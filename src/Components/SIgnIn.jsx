import React from 'react';
import { Input, Button } from './index.js';
import axios from '../api/axios.js';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function SignIn() { 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    const { emailorusername, password } = e.target;

    try {
      const data = await axios.post(
        `${String(import.meta.env.VITE_API_URL)}/api/v1/users/login`,
        {
          email: emailorusername.value,
          username: emailorusername.value,
          password: password.value,
        }
      );

      dispatch(authLogin(data.data.data.user));
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900" style={{ height: '90vh' }}>
      <div className="rounded-xl shadow-lg flex flex-col gap-6 justify-center items-center w-1/3 bg-gray-800 p-8">
        <h1 className="text-4xl font-extrabold text-gray-100 tracking-wide">Welcome Back</h1>
        <p className="text-gray-400 text-center text-sm">
          Sign in to continue and explore amazing content.
        </p>
        <form 
          className="flex flex-col items-center gap-4 w-full"
          onSubmit={(e) => login(e)}
        >
          <Input
            name="emailorusername"
            className="w-3/4 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            label="Email or Username"
            type="text"
            placeholder="Enter your email or username"
          />
          <Input
            name="password"
            className="w-3/4 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          <Button
            type="submit"
            label="Login"
            classname="w-4/4 bg-blue-600 text-white font-bold rounded-lg py-2 hover:bg-blue-700 transition-all"
          />
        </form>
        <Link
          to="/signup"
          className="text-gray-400 text-sm hover:underline hover:text-blue-400"
        >
          Don’t have an account? Sign Up
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
