import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/register', {
        username,
        password,
      });
      if (response.data.success) {
        alert('Usuário cadastrado com sucesso!');
        navigate('/'); // Redireciona para a tela de login
      }
    } catch (error) {
      alert('Erro ao cadastrar usuário. Talvez o username já exista.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Cadastre-se</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="username">Login</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toUpperCase())}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value.toUpperCase())}
            required
          />
          <button type="submit">Cadastrar</button>
          <button type="button" onClick={() => navigate('/')}>
            Voltar ao Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;