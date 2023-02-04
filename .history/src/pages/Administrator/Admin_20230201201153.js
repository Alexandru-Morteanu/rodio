import Peer from 'peerjs';
import React, { useState } from 'react'
import { useAuth } from '../Login/AuthContext'

function Admin() {
  const [error, setError] = useState("")
  const { logout } = useAuth()
  const peer = new Peer("1");
  let localPeerId;
  peer.on('open', id => {
    localPeerId = id;
    console.log(localPeerId);
  });
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
      
    </div>
  )
}

export default Admin