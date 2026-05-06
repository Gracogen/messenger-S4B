import { useState } from 'react';
import { login, saveToken, register } from '../services/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log('Logging in...');
      const result = await login(username, password);
      console.log('Login success:', result);

      if (result.access_token) {
        saveToken(result.access_token);
        console.log('Token saved');
        alert('Login successful!');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Check your username/password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!displayName || !username || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Registering...');
      const result = await register(username, displayName, password);
      console.log('Register success:', result);

      if (result.access_token) {
        saveToken(result.access_token);
        console.log('Token saved');
        alert(`Welcome ${result.user?.display_name || displayName}! Registration successful.`);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response?.data?.message) {
        alert(`Registration failed: ${error.response.data.message}`);
      } else if (error.response?.data?.detail) {
        alert(`Registration failed: ${JSON.stringify(error.response.data.detail)}`);
      } else {
        alert('Registration failed. Username may already exist or password too short.');
      }
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Username
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
          placeholder="Choose a username"
          disabled={isLoading}
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
          placeholder="Minimum 8 characters"
          disabled={isLoading}
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: isLoading ? '#cccccc' : '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: '10px'
        }}
      >
        {isLoading ? 'Please wait...' : 'Login'}
      </button>

      <button
        onClick={handleRegister}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'transparent',
          color: '#0066cc',
          border: '1px solid #0066cc',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Please wait...' : 'Create Account'}
      </button>
    </div>
  );
}

export default Login;