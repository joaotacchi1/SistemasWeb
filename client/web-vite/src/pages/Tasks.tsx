import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios, {AxiosError} from 'axios';

interface Task {
  id: number;
  description: string;
  deadline: string;
  assignedTo: string;
  observation?: string;
  status: 'to_do' | 'in_progress' | 'done';
  userUsername: string;
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
  const username = location.state?.username || 'unknown';

  useEffect(() => {
    fetchTasks();
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
    try {
      const response = await axios.post<Task>('http://localhost:3001/tasks', {
        ...newTask,
        userUsername: username,
      });
      // Adiciona a nova tarefa diretamente ao estado, evitando a necessidade de fetch imediato
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setNewTask({ description: '', deadline: '', assignedTo: '', observation: '', userUsername: '' });
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      fetchTasks(); // Fallback para buscar tarefas caso a adição falhe
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: Task['status']) => {
    try {
      const response = await axios.put<Task>(`http://localhost:3001/tasks/${id}`, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Erro ao atualizar status:', {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      fetchTasks(); // Sincroniza com o backend em caso de erro
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      fetchTasks(); // Fallback
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // +1 porque getUTCMonth é 0-based
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="tasks-container">
      <h2>Tarefas da República</h2>
      <form onSubmit={handleAddTask}>
        <input
          placeholder="Descrição"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value})}
        />
        <input
          placeholder="Designado para"
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
        />
        <input
          placeholder="Observação"
          value={newTask.observation}
          onChange={(e) => setNewTask({ ...newTask, observation: e.target.value })}
        />
        <input
          placeholder="Designado por"
          value={username}
          onChange={(e) => setNewTask({ ...newTask, userUsername: e.target.value })}
        />
        <button type="submit">Adicionar</button>
      </form>
      <div className="kanban">
        <div>
          <h3>A Fazer</h3>
          {tasks.filter((t) => t.status === 'to_do').map((task) => (
            <div key={task.id} className="task-card">
              <p>{task.description}</p>
              <p>Prazo: {formatDate(task.deadline)}</p>
              <p>Para: {task.assignedTo}</p>
              <p>{task.observation}</p>
              <p>Designado por: {task.userUsername}</p>
              <button onClick={() => handleUpdateStatus(task.id, 'in_progress')}>
                Iniciar
              </button>
              <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
            </div>
          ))}
        </div>
        <div>
          <h3>Em Andamento</h3>
          {tasks.filter((t) => t.status === 'in_progress').map((task) => (
            <div key={task.id} className="task-card">
              <p>{task.description}</p>
              <p>Prazo: {formatDate(task.deadline)}</p>
              <p>Para: {task.assignedTo}</p>
              <p>{task.observation}</p>
              <p>Designado por: {task.userUsername}</p>
              <button onClick={() => handleUpdateStatus(task.id, 'done')}>
                Concluir
              </button>
              <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
            </div>
          ))}
        </div>
        <div>
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
  );
};

export default Tasks;