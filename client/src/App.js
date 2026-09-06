import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Myprofile from './Myprofile';
import IndProfile from './IndProfile';
import Navbar from './Navbar';
import { ToastProvider } from './Toast';
import './App.css';

const App = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/myprofile" element={<Myprofile />} />
              <Route
                path="/indprofile/:fullname/:email/:skill/:id"
                element={<IndProfile />}
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
