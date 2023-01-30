import React from 'react'
import "./Homepage.css"
import { Link } from "react-router-dom";
function Homepage() {
  return (
    <div className='containerHome'>
        <div>
            <b>RODIO</b>
            <Link to='/control'>CONTROL STATION </Link>
            <div className='vizualizer'></div>
            <button>ON/OFF</button>
            <button>Volume</button>
            <button>Next</button>
        </div>
        <div>
            <div className='adds'></div>
            <div className='currentStation'></div>
        </div>
    </div>
  )
}

export default Homepage