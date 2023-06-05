import React, { useContext } from 'react'
import { LocationContext } from './LocationContext'

export default function LocationDetails() {
    const [locationContext] = useContext(LocationContext)
    return <p> <b>Location Details: </b> Location: {locationContext} details </p>
}