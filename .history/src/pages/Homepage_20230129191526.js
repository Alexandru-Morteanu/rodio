import React from 'react'
import "./Homepage.css"
function Homepage() {
  return (
    <div className='containerHome'>
        <b>RODIO</b>
        <button>CONTROL STATION</button>
        <div className='vizualizer'></div>
        <div className='adds'></div>
        <button>ON/OFF</button>
        <button>Volume</button>
        <button>Next</button>
        <div className='currentStation'></div>

    </div>
  )
}

export default Homepage