import React from 'react'
import "./Homepage.css"
function Homepage() {
  return (
    <div className='containerHome'>
        <b>RODIO</b>
        <button>CONTROL STATION</button>
        <div className='vizualizer'></div>
        <div className='adds'></div>
        <div className='currentStation'></div>

    </div>
  )
}

export default Homepage