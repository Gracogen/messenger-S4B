import { useState } from 'react';
import { login, saveToken, register, saveUserKeys } from '../services/api';

function Login() {
  const [username, setUsername] = useState('');     // username or email
  const [password, setPassword] = useState('');     // password
  const [displayName, setDisplayName] = useState('');

  // const handleLogin = () => {
  //   console.log('Login clicked');
  //   console.log('Username:', username);
  //   console.log('Password:', password);
  // };
  const handleLogin = async () => {
  try {
    console.log('Logging in...');
    const result = await login(username, password);
    console.log('Login success:', result);
    
    // Save the token
    if (result.token) {
      saveToken(result.token);
      console.log('Token saved');
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed. Check your username/password.');
  }
};

  // This runs when user clicks Create Account button (for now just logs)
  // const handleRegister = () => {
  //   console.log('Switch to registration');
  // };

  const handleRegister = async () => {
  try {
    console.log('Registering...');
    const result = await register(username, displayName, password);
    console.log('Register success:', result);

     // Save the token
    if (result.access_token) {
      saveToken(result.access_token);
      console.log('Token saved');
      
      // Store user info
      if (result.user) {
        alert(`Welcome ${result.user.display_name}! Registration successful.`);
      }
    }
    // // After registration, automatically log in
    // if (result.token) {
    //   saveToken(result.token);
    //   console.log('Token saved');
    // }
  } catch (error) {

    console.error('Registration failed:', error);
if (error.response?.data?.message) {
      alert(`Registration failed: ${error.response.data.message}`);
    } else {
      alert('Registration failed. Username may already exist.');
    }
  }  

};

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center' }}>WhisperBox</h1>

      <div style={{ marginBottom: '15px' }}>
  <label style={{ display: 'block', marginBottom: '5px' }}>
    Display Name
  </label>
  <input
    type="text"
    value={displayName}
    onChange={(e) => setDisplayName(e.target.value)}
    style={{
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    }}
    placeholder="How others see you"
  />
</div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Username or Email
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          placeholder="Enter your username"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          placeholder="Enter your password"
        />
      </div>

      <button
        onClick={handleLogin}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        Login
      </button>

      <button
        onClick={handleRegister}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'transparent',
          color: '#0066cc',
          border: '1px solid #0066cc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Create Account
      </button>
    </div>
  );
}

export default Login;