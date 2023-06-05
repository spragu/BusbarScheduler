import React, { useContext,useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import LocationsMainGrid from './components/location/LocationsMainGrid'
import LocationDetails from './components/location/LocationDetails'
import { Layout } from './components/layout'
import { MeasurementContext } from './components/MeasurementContext'



export default function App({ SignalRConnection })
{

    const [measurementContext, setMeasurementContext] = useState(useContext(MeasurementContext))

    useEffect(() => {
        
        SignalRConnection.on("InitialLoad", (initialLoadRes) => {
            console.log("Initial load incoming")          
            console.log(measurementContext);
        })

        SignalRConnection.on("UpdateMeasurements", (bbarMEasurements) => {
            console.log("Measurements incoming")
            setMeasurementContext(bbarMEasurements);
            console.log(JSON.stringify(bbarMEasurements));
        })

        const initialLoadRes = async () => {
            try {
                await SignalRConnection.invoke("InitialLoad");
            } catch (err) {
                console.error(err);
            }
        };
        initialLoadRes();
    }, []);

    useEffect(() => {

       
            console.log("Measurement context: " + JSON.stringify(measurementContext))

    }, [measurementContext]);

    return (
        <MeasurementContext.Provider value={[measurementContext, setMeasurementContext]}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element= < Layout />>
                        <Route index element= <LocationsMainGrid/> />
                        <Route path="locationDetails" element= <LocationDetails/> />
                    </Route>
                </Routes>
                </BrowserRouter>
        </MeasurementContext.Provider>
        //</LocationContext.Provider>

    );


}



