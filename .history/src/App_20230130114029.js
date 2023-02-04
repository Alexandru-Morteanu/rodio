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
  ]
  return (
    <div className="App">
      <div className='container'>  
      <Router>
          <Link to='/control'> CONTROL STATION </Link>
          <Switch>
            {stations.map((path) => (
              <Route path={path} component={ Homepage } key={path} />
            ))}
            <Route path="/control" component={ ControlStation } />
            <PrivateRoute path="/admin" component={ Admin } />
          </Switch>   
      </Router>
      </div>
    </div>
  );
}

export default App;
