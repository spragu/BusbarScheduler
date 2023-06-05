using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

MainRepo mainRepo = new MainRepo();
var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddSingleton(mainRepo);


builder.Services.AddCors(options => {
    options.AddDefaultPolicy(
        builder => {
            builder.WithOrigins("https://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});
var app = builder.Build();


// Configure the HTTP request pipeline.
if(app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// UseCors must be called before MapHub.
app.UseCors();
app.MapHub<BBSchedHub>("/BBSchedHub");

makeLocations();
startMainLoop();
app.Run();



void makeLocations() {
    //Create 10 locations
    for(int i = 1; i <= 10; i++) {
        //Each location has between 1-4 bbars
        int bbarCount = new Random().Next(1, 5);
        int[] bbarIds = new int[bbarCount];
        for(int j = 0; j < bbarCount; j++) {
            int bbarId = i * 10 + j;
            mainRepo.bbars.Add(new BBar(bbarId, $"BBar_{bbarId}", 100, 10));
            bbarIds[j] = bbarId;
            mainRepo.bbarMeasurements.Add(new BBarMeasurement(bbarId, 0, "OK"));
        }
        mainRepo.locs.Add(new Loc(i, $"Location_{i}", bbarIds));
    }
}

void startMainLoop() {
    var autoEvent = new AutoResetEvent(false);
    var stateTimer = new Timer(UpdateMeasurements, autoEvent, 1000, 1000);
}
async void UpdateMeasurements(object? stateInfo) {
    foreach(var bbarMeasurement in mainRepo.bbarMeasurements) {
        var bbar = mainRepo.bbars.Find(b => b.Id == bbarMeasurement.BBarId);
        //Simulate measurement within 20% of nominal value
        double newMeasurement = bbar!.NominalMeasurement * (0.8 + 0.4 * new Random().NextDouble());
        bbarMeasurement.Measurement = newMeasurement;
        if(Math.Abs(newMeasurement - bbar!.NominalMeasurement) > bbar!.MeasurementTolerance)
            bbarMeasurement.ExcursionStatus = "Failure";
        else
            bbarMeasurement.ExcursionStatus = "OK";
    }
    //Emit updated measurements
    var hubContext = app.Services.GetService<IHubContext<BBSchedHub>>();
    var measurements = mainRepo.bbarMeasurements.ToArray();
    await hubContext.Clients.All.SendAsync("UpdateMeasurements", measurements);
}


internal class BBSchedHub : Hub {

    readonly MainRepo MainRepo;

    public BBSchedHub([FromServices] MainRepo _mainRepo) {
        MainRepo = _mainRepo;
    }

    public async Task InitialLoad() {
        await Clients.Caller.SendAsync("InitialLoad", new { Locations = MainRepo.locs, });
    }

}

internal record BusbarSchedulerEntity(int Id, string Name);
internal record Loc(int Id, string Name, int[] ChildrenBusbarIds) : BusbarSchedulerEntity(Id, Name);
internal record BBar(int Id, string Name, int NominalMeasurement, int MeasurementTolerance) : BusbarSchedulerEntity(Id, Name);
[Serializable]
public class BBarMeasurement { 
    public int BBarId { get; set; } 
    public double Measurement { get; set; }
    public string ExcursionStatus { get; set; }
    public BBarMeasurement(int bBarId, double measurement, string excursionStatus) {
        BBarId = bBarId;
        Measurement = measurement;
        ExcursionStatus = excursionStatus;
    }
}

[Serializable]
class MainRepo {

    public List<Loc> locs { get; set; } = new();

public List<BBar> bbars  { get; set; } = new();

    public List<BBarMeasurement> bbarMeasurements { get; set; } = new();

}







