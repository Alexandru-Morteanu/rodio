import React, { useState } from 'react'

function Admin() {
  const [error, setError] = useState()

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
      <button onClick={ handleLogout }>Sign Out</button>
    </div>
  )
}

export default Admin