import React from "react"
import { Route } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function PrivateRoute({ element: Component, ...rest }) {
  const { currentUser } = useAuth()
  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : window.location.href = "/"
      }}
    ></Route>
  )
}
