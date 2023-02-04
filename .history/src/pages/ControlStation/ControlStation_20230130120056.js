import React from 'react'
import { Link, useHistory } from 'react-router-dom'

function ControlStation() {
  const history = useHistory()
  return (
    <div>ControlStation
        <Link onClick={ history.push("/96") } to='/96'>96</Link>
    </div>
  )
}

export default ControlStation