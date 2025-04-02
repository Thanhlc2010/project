"use client";

import React from 'react';
// import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './globals.css';
import LayoutWrap from './component/LayoutWrap';
import Home from './pages/home';
import LoginForm from './pages/login';

function App() {
    return (
      <BrowserRouter>
        <LayoutWrap auth={false}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </LayoutWrap>
      </BrowserRouter>
    );
  }
  
  export default App;