
// Frontend (React.js)
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      // const res = await axios.post('http://localhost:5000/register', { username, email, password });
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/register`, { username, email, password });
      setMessage('Registration successful!');
    } catch (err) {
      setMessage('Error during registration');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
    </div>
  );
};

export default Register;