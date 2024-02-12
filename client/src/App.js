import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Invoices from './pages/Invoices';
import Storage from './pages/Storage';
import Suppliers from './pages/Suppliers';
import Employees from './pages/Employees';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/products' element={<Products/>} />
          <Route path='/suppliers' element={<Suppliers/>} />
          <Route path='/employees' element={<Employees/>} />
          <Route path='/storage' element={<Storage/>} />
          <Route path='/invoices' element={<Invoices/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
