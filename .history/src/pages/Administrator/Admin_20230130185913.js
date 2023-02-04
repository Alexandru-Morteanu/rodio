import React, { useState } from 'react'
import { useAuth } from '../Login/AuthContext'

function Admin() {
  const [error, setError] = useState("")
  const { logout } = useAuth()

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