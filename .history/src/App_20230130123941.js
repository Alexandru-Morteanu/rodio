import React from 'react';
import './App.css';
import Homepage from "./pages/Homepage.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './pages/Login/PrivateRoute';
import Admin from './pages/Administrator/Admin';
import ControlStation from './pages/ControlStation/ControlStation';
function App() {
  const stations = [
    "/96",
    "/98",
    "/99",
    "/102"
  ]/*
  {stations.map((path) => (
    <Route path={path} component={ Homepage } key={path} />
  ))}
  */
  return (
    <div className="App">
      <div className='container'>  
      <Router>
          <Switch>
            <Route path="/96" component={ Homepage } />
            <Route path="/control" component={ ControlStation } />
          </Switch>   
      </Router>
      </div>
    </div>
  );
}

export default App;
