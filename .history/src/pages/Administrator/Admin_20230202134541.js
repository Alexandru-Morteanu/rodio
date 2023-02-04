import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { peer } from '../../App';
import { localPeerId as remotePeerId } from '../Homepage';
import { useAuth } from '../Login/AuthContext'

function Admin() {
  const [error, setError] = useState("")
  const { logout } = useAuth()
  let localPeerId;
  const [audioElement, setAudioElement] = useState(new Audio());
  let [localStream, setLocalStream] = useState();
  const [k, setK] = useState(1);
  peer.on('open', id => {
    localPeerId = id;
    console.log(localPeerId);
  });
  let handleFileChange = event => {
    localStream =  window.URL.createObjectURL(event.target.files[0]);
    audioElement.src = localStream;
    console.log(localStream)
  };

  const handleStart = () => {
    if (k == 1) {
      audioElement.play();
      setK(0);
    } else {
      audioElement.pause();
      setK(1);
    }
  };

  audioElement.addEventListener('canplay', () => {
    setLocalStream(audioElement.captureStream());
  });
  const handleCall = () => {
    peer.call("cddcdbb5-b031-4d42-a616-2b94016a9a62", localStream);
    console.log(remotePeerId);
    console.log(localStream);
  };
  async function handleLogout() {
    setError("")
    try {
      await logout()
    } catch {
      setError("Failed to log out")
    }
  }
  return (
    <div>Admin
      <button onClick={ handleLogout }>Log Out</button>
      <button onClick={ handleCall }>Call</button>
      <button onClick={ handleStart }>Start</button>
      <input type="file" onChange={handleFileChange} />
      <Link to='96'>96</Link>
    </div>
  )
}

export default Admin