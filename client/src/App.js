import React from 'react';
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Home from './Home';
import './App.css';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Myprofile from './Myprofile';
import IndProfile from './IndProfile';
const App = () => {
  return (
    <div>
      <center>
        <BrowserRouter>
        <Routes>
        <Route exact path='/' element={<Home/>}  />
        <Route exact path='/login' element={<Login/>}  />
        <Route exact path='/register' element={<Register/>}  />
        <Route exact path='/dashboard' element={<Dashboard/>}  />
        <Route exact path='/myprofile' element={<Myprofile/>}  />
        <Route exact path='/indprofile/:fullname/:email/:skill/:id' element={<IndProfile/>}  />
        </Routes>         
        </BrowserRouter>
       </center> 
    </div>
  )
}

export default App
