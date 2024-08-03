import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import UserRepositories from './pages/UserRepositories';
import StackRepositories from './pages/StackRepositories';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>GitPath</h1>
          <nav>
          <br />
          <br />
            <Link to="/">Home</Link>
            <br />
            <br />
            <Link to="/user-repositories">Your Journey</Link>
            <br />
            <br />
            <Link to="/stack-repositories">Path Forward</Link>
          </nav>
        </header>
        <main className="w-full flex flex-col items-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user-repositories" element={<UserRepositories />} />
            <Route path="/stack-repositories" element={<StackRepositories />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
