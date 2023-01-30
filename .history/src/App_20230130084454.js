import React from 'react';
import './App.css';
import Homepage from "./pages/Homepage.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from './pages/Login/PrivateRoute';
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
          <Routes>
            {stations.map((path) => (
              <Route path={path} element={<Homepage  />} key={path} />
            ))}
            <PrivateRoute path="/admin" element={<Admin />}
          </Routes>   
      </Router>
      </div>
    </div>
  );
}

export default App;
