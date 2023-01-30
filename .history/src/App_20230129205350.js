import React from 'react';
import './App.css';
import Homepage from "./pages/Homepage.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <div className='container'>  
      <Router>
          <Routes>
            <Route exact path="/" element={<Homepage />} />
          </Routes>   
      </Router>
      </div>
    </div>
  );
}

export default App;
