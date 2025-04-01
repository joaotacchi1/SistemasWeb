import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Tasks from './pages/Tasks.tsx';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/tasks" element={<Tasks />} />
    </Routes>
  );
};

export default App;