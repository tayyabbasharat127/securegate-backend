import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';


export default function App(){
return (
<BrowserRouter>
<Routes>
<Route path='/' element={<Login/>} />
<Route path='/signup' element={<Signup/>} />
<Route path='/login' element={<Login/>} />
<Route path='/dashboard' element={<Dashboard/>} />
</Routes>
</BrowserRouter>
);
}