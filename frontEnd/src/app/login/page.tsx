"use client";
import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted with:', { username, password });
    // Add your authentication logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat" 
         style={{ backgroundImage: "url('https://raw.githubusercontent.com/CiurescuP/LogIn-Form/main/bg.jpg')" }}>
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md h-auto p-5 rounded-2xl border-5 border-white border-opacity-10 
                  bg-white bg-opacity-10 backdrop-blur-sm shadow-lg relative"
        style={{ boxShadow: '0 0 40px rgba(129, 236, 174, 0.6)' }}
      >
        <h3 className="text-4xl font-semibold text-white text-center mb-6">Login Here</h3>
        
        <label htmlFor="username" className="block text-2xl font-bold text-white mt-6 mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          placeholder="Email or Phone"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 text-sm text-white bg-black bg-opacity-20 rounded-md border-2 
                    border-gray-700 border-opacity-30 focus:outline-none focus:bg-gray-700 
                    hover:bg-gray-700 transition-all duration-500"
        />
        
        <label htmlFor="password" className="block text-2xl font-bold text-white mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 text-sm text-white bg-black bg-opacity-20 rounded-md border-2 
                    border-gray-700 border-opacity-30 focus:outline-none focus:bg-gray-700 
                    hover:bg-gray-700 transition-all duration-500"
        />
        
        <button
          type="submit"
          className="w-full p-2 mt-8 mb-4 text-lg font-semibold text-gray-100 bg-black bg-opacity-20 
                    rounded-md border-2 border-gray-700 border-opacity-30 cursor-pointer 
                    hover:bg-green-700 focus:bg-green-700 transition-all duration-500"
        >
          Log In
        </button>
        
        <p className="text-lg text-white text-center mb-4">
          Login with a social media account
        </p>
        
        <div className="flex justify-center items-center space-x-3">
          <button
            type="button"
            className="flex items-center justify-center h-10 w-10 rounded-full 
                      bg-transparent hover:shadow-lg focus:shadow-lg transition-all duration-500"
          >
            <i className="fab fa-facebook text-xl text-white"></i>
          </button>
          <button
            type="button"
            className="flex items-center justify-center h-10 w-10 rounded-full 
                      bg-transparent hover:shadow-lg focus:shadow-lg transition-all duration-500"
          >
            <i className="fab fa-twitter text-xl text-white"></i>
          </button>
          <button
            type="button"
            className="flex items-center justify-center h-10 w-10 rounded-full 
                      bg-transparent hover:shadow-lg focus:shadow-lg transition-all duration-500"
          >
            <i className="fab fa-instagram text-xl text-white"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;