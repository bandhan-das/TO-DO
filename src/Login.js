import React, { useState } from 'react';
import { auth } from './firebase-config'; // Adjust the path based on where your firebase-config file is located
import { useHistory } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory(); // This hook gives you access to the history instance that you may use to navigate.

  const login = async (e) => {
    e.preventDefault(); // Prevents the form from being submitted traditionally

    try {
      await auth.signInWithEmailAndPassword(email, password);
      history.push("/"); // Redirect to home page after successful login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={login}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
