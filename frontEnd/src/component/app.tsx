"use client";

import React from 'react';
// import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import '../globals.css';
// import '../app/';
import LayoutWrap from './LayoutWrap';
import Home from '../app/pages/home';
function App() {
    return (
      <BrowserRouter>
        <LayoutWrap auth={false}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </LayoutWrap>
      </BrowserRouter>
    );
  }
  
  export default App;