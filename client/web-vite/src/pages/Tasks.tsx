import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

interface Task {
  id: number;
  description: string;
  deadline: string;
  assignedTo: string;
  observation?: string;
  status: 'to_do' | 'in_progress' | 'done';
  userUsername: string;
  pingometer: number;
}

interface NewTask {
  description: string;
  deadline: string;
  assignedTo: string;
  observation: string;
  userUsername: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    description: '',
    deadline: '',
    assignedTo: '',
    observation: '',
    userUsername: '',
  });
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;

  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [username, navigate]);

  useEffect(() => {
    fetchTasks();
    // Atualiza o pingômetro a cada 5 minutos
    const interval = setInterval(fetchTasks, 5 * 60 * 1000); // 5 minutos
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>('http://localhost:3001/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    try {
      const response = await axios.post<Task>('http://localhost:3001/tasks', {
        ...newTask,
        userUsername: username,
      });
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setNewTask({ description: '', deadline: '', assignedTo: '', observation: '', userUsername: '' });
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      fetchTasks();
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: Task['status']) => {
    try {
      await axios.put<Task>(`http://localhost:3001/tasks/${id}`, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: newStatus, pingometer: newStatus === 'done' ? 0 : task.pingometer } : task
        )
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Erro ao atualizar status:', {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      fetchTasks();
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      fetchTasks();
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!username) return null;

  return (
    <div className="tasks-page">
      <div className="tasks-container">
      <img src="/public/capacete.png" alt="Foto da República" className="republica-photo" />
        <h2>Tarefas da República</h2>
        <form onSubmit={handleAddTask}>
          <label htmlFor="description">Descrição</label>
          <input
            id="description"
            placeholder="Descrição"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <label htmlFor="deadline">Prazo</label>
          <input
            id="deadline"
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          />
          <label htmlFor="assignedTo">Designado para</label>
          <input
            id="assignedTo"
            placeholder="Designado para"
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          />
          <label htmlFor="observation">Observação</label>
          <input
            id="observation"
            placeholder="Observação"
            value={newTask.observation}
            onChange={(e) => setNewTask({ ...newTask, observation: e.target.value })}
          />
          <label htmlFor="userUsername">Designado por</label>
          <input
            id="userUsername"
            placeholder="Designado por"
            value={username}
            onChange={(e) => setNewTask({ ...newTask, userUsername: e.target.value })}
            disabled
          />
          <button type="submit">Adicionar</button>
        </form>
        <div className="kanban">
          <div className="kanban-column">
            <h3>A Fazer</h3>
            {tasks.filter((t) => t.status === 'to_do').map((task) => (
              <div key={task.id} className="task-card">
                <p>{task.description}</p>
                <p>Prazo: {formatDate(task.deadline)}</p>
                <p>Para: {task.assignedTo}</p>
                <p>{task.observation}</p>
                <p>Designado por: {task.userUsername}</p>
                {task.pingometer > 0 && (
                  <p className="pingometer">Pingômetro: {task.pingometer} dose(s)</p>
                )}
                <button onClick={() => handleUpdateStatus(task.id, 'in_progress')}>
                  Iniciar
                </button>
                <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
              </div>
            ))}
          </div>
          <div className="kanban-column">
            <h3>Em Andamento</h3>
            {tasks.filter((t) => t.status === 'in_progress').map((task) => (
              <div key={task.id} className="task-card">
                <p>{task.description}</p>
                <p>Prazo: {formatDate(task.deadline)}</p>
                <p>Para: {task.assignedTo}</p>
                <p>{task.observation}</p>
                <p>Designado por: {task.userUsername}</p>
                {task.pingometer > 0 && (
                  <p className="pingometer">Pingômetro: {task.pingometer} dose(s)</p>
                )}
                <button onClick={() => handleUpdateStatus(task.id, 'done')}>
                  Concluir
                </button>
                <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
              </div>
            ))}
          </div>
          <div className="kanban-column">
            <h3>Concluídas</h3>
            {tasks.filter((t) => t.status === 'done').map((task) => (
              <div key={task.id} className="task-card">
                <p>{task.description}</p>
                <p>Prazo: {formatDate(task.deadline)}</p>
                <p>Para: {task.assignedTo}</p>
                <p>{task.observation}</p>
                <p>Designado por: {task.userUsername}</p>
                <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;