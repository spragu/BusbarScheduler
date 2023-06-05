import React from 'react'
import {Outlet} from "react-router-dom"

import {Navigation} from './Navigation'
import './location/LocationStyle.css'

export const Layout = () =>
    <div className="main-div">     
        <Navigation/>
        <Outlet/> 
    </div>