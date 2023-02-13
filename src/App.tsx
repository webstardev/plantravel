import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Result from './pages/Result/Result';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/search' element={<Result />} />
      </Routes>
    </div>
  );
}

export default App;
