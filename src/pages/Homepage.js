import React from 'react'
import "./Homepage.css"
import { Link, useLocation } from "react-router-dom";
function Homepage() {
  const location = useLocation()
  const path = location.pathname.split('/');
  return (
    <div className='containerHome'>
        <div>
            <b>RODIO</b>
            <Link to='/control'> CONTROL STATION </Link>
            <div className='vizualizer'></div>
            <button>ON/OFF</button>
            <button>Volume</button>
            <button>Next</button>
            <div>{path}</div>
        </div>
        <div>
            <div className='adds'></div>
            <div className='currentStation'></div>
        </div>
    </div>
  )
}

export default Homepage