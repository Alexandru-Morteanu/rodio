import React from 'react';
import './App.css';
import Homepage from "./pages/Homepage.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./pages/Login/AuthContext"
import PrivateRoute from './pages/Login/PrivateRoute';
import Admin from './pages/Administrator/Admin';
import Login from './pages/Login/Login';
import SignUp from './pages/Login/SignUp';
import ControlStation from './pages/ControlStation/ControlStation';
import Peer from 'peerjs';
export const peer = new Peer();
function App() {
  const stations = [
    "/96",
    "/98",
    "/99",
    "/102"
  ]
  return (
    <div className="App">
      <div className='container'>  
      <Router>
          <Switch>
            {stations.map((path) => (
             <Route path={path} component={ Homepage } key={path} />
            ))}
            <Route path="/control" component={ ControlStation } />
            <AuthProvider>
              <Route path="/login" component={ Login } />
              <Route path="/signup" component={ SignUp } />
              <PrivateRoute path="/admin" component={ Admin } />
            </AuthProvider>
          </Switch>   
      </Router>
      </div>
    </div>
  );
}

export default App;
