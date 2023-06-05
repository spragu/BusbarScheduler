const signalR = require("@microsoft/signalr");
var Connection = false;

export async function Start() {
    RegisterHandlers()
    try {       
        console.log("Connecting to sigr")
        await Connection.start();
        console.log("SignalR Connected.");       
    }
    catch (connectionEx) {

    }   
};

export function SetConnection() {
    Connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7066/BBSchedHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();
    return Connection;
}

function RegisterHandlers() {



    Connection.onclose(async () => {
        await Start();
    });
}




