import React, { useState } from 'react';

const LoginForm = ({ handleLoginToBE }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginToBE(username, password);
    // Reset the form fields
    setUsername('');
    setPassword('');
  };
  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
