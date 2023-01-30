import React from 'react';
import './App.css';
import Homepage from "./pages/Homepage.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <div className='container'>  
          <Routes>
            <Route exact path="/" element={<Homepage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
