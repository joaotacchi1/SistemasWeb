import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });
      if (response.data.success) {
        navigate('/tasks', { state: { username } });
      }
    } catch (error) {
      alert('Erro ao fazer login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Login</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toUpperCase())}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value.toUpperCase())}
          />
          <button type="submit">Entrar</button>
          <button type="button" onClick={() => navigate('/register')}>
            Cadastre-se
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;