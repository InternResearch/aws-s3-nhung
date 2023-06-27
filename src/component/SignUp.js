import React, { useState } from 'react';

const SignUp = ({ handleSignUpToBE }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    handleSignUpToBE(username, password);
    // Reset the form fields
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setPasswordMatchError(false);
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      {passwordMatchError && <p className="error">Passwords do not match</p>}
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
