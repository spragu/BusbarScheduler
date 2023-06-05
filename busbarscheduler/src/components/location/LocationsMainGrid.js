import { useContext } from 'react'
import { MeasurementContext } from '../MeasurementContext'
import './LocationStyle.css';

export default function LocationsMainGrid() {
    const [measurementContext] = useContext(MeasurementContext) 
    return measurementContext.map(location => { return getLoc(location) });
    // location.excursionStatus == "Failure" ? 'text-strike' : null
    function getLoc(location) {
        return (
            <div className={location.excursionStatus == "Failure" ? "RedBG" : "OkBg"} >
                <button>{location.bBarId}</button>
                >
                <button>{location.measurement}</button>
            </div>
            );
    }
}