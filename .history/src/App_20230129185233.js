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
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </nav>
          <Routes>
            <Route exact path="/" element={<Homepage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
