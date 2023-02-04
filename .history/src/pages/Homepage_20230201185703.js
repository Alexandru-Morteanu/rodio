import React, { useState } from 'react'
import "./Homepage.css"
import { Link, useLocation } from "react-router-dom";
import Peer from 'peerjs';
function Homepage() {
  
  
  const location = useLocation()
  const path = location.pathname.split('/');

  let [localPeerId, setLocalPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [audioElement, setAudioElement] = useState(new Audio());
  const [localStream, setLocalStream] = useState();
  const [k, setK] = useState(1);

  const peer = new Peer();
  peer.on('open', id => {
    localPeerId = id;
  });
  console.log(localPeerId);
  return (
    <div className='containerHome'>
        <div>
            <b>RODIO</b>
            <Link to="/control"> CONTROL STATION </Link>
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