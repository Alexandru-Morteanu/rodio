import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { localPeerId } from "../Homepage"
function ControlStation() {
  const history = useHistory()
  return (
    <div>ControlStation
        <div>
            <Link to='login'>login </Link>
            <Link to='signup'> signup</Link>
        </div>
        <Link to='96'>96</Link>
        <div>{localPeerId}</div>
    </div>
  )
}

export default ControlStation