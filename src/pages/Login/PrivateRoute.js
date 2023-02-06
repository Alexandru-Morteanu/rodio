import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log(localStorage.getItem("token"))
  return <Route
  {...rest}
  render={props =>
    localStorage.getItem("token") ? (
      <Component {...props} />
    ) : (
      <Redirect
        to="/96"
      />
    )
  }
/>;
};

export default PrivateRoute;