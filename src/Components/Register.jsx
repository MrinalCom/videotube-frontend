import React from 'react';
import axios from '../api/axios.js';
import { Input, Button } from './index.js';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const { fullname, email, password, username } = e.target;

    try {
      const data = await axios.post('/api/v1/users/register', {
        fullName: fullname.value,
        email: email.value,
        username: username.value,
        password: password.value,
      });

      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900" style={{ height: '90vh' }}>
      <div className="rounded-xl shadow-xl flex flex-col gap-6 justify-center items-center w-1/3 bg-gray-800 p-8">
        <h1 className="text-4xl font-extrabold text-gray-100 tracking-wide">Create Your Account</h1>
        <p className="text-gray-400 text-center text-sm">
          Join us and start exploring amazing content today.
        </p>
        <form
          className="flex flex-col items-center gap-4 w-full"
          onSubmit={(e) => handleRegister(e)}
        >
          <Input
            name="fullname"
            className="w-3/4 text-black border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
          />
          <Input
            name="email"
            className="w-3/4 text-black border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            label="Email"
            type="email"
            placeholder="Enter your email address"
          />
          <Input
            name="username"
            className="w-3/4 text-black border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            label="Username"
            type="text"
            placeholder="Choose a username"
          />
          <Input
            name="password"
            className="w-3/4 text-black border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            label="Password"
            type="password"
            placeholder="Create a password"
          />
          <Button
            type="submit"
            label="Sign Up"
            classname="w-4/4 bg-blue-600 text-white font-bold rounded-lg py-2 hover:bg-blue-700 transition-all"
          />
        </form>
        <Link
          to="/login"
          className="text-gray-400 text-sm hover:underline hover:text-blue-400"
        >
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}

export default Register;
