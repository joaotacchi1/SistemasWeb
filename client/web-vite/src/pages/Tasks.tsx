import { useState, useEffect } from 'react';
import axios from 'axios';

// Tipo para as tarefas
interface Task {
  id: number;
  description: string;
  deadline: string;
  assignedTo: string;
  observation?: string;
  status: 'to_do' | 'in_progress' | 'done';
}

// Tipo para o estado da nova tarefa
interface NewTask {
  description: string;
  deadline: string;
  assignedTo: string;
  observation: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    description: '',
    deadline: '',
    assignedTo: '',
    observation: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get<Task[]>('http://localhost:3001/tasks');
    setTasks(response.data);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/tasks', {
      ...newTask,
      userId: 1, // Simulação de usuário logado
    });
    fetchTasks();
    setNewTask({ description: '', deadline: '', assignedTo: '', observation: '' });
  };

  const handleUpdateStatus = async (id: number, status: Task['status']) => {
    await axios.put(`http://localhost:3001/tasks/${id}`, { status });
    fetchTasks();
  };

  const handleDeleteTask = async (id: number) => {
    await axios.delete(`http://localhost:3001/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="tasks-container">
      <h2>Tarefas da República</h2>

      {/* Formulário de nova tarefa */}
      <form onSubmit={handleAddTask}>
        <input
          placeholder="Descrição"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
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
        <button type="submit">Adicionar</button>
      </form>

      {/* Kanban */}
      <div className="kanban">
        <div>
          <h3>A Fazer</h3>
          {tasks
            .filter((t) => t.status === 'to_do')
            .map((task) => (
              <div key={task.id} className="task-card">
                <p>{task.description}</p>
                <p>Prazo: {new Date(task.deadline).toLocaleDateString()}</p>
                <p>Para: {task.assignedTo}</p>
                <p>{task.observation}</p>
                <button onClick={() => handleUpdateStatus(task.id, 'in_progress')}>
                  Iniciar
                </button>
                <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
              </div>
            ))}
        </div>
        <div>
          <h3>Em Andamento</h3>
          {tasks
            .filter((t) => t.status === 'in_progress')
            .map((task) => (
              <div key={task.id} className="task-card">
                <p>{task.description}</p>
                <button onClick={() => handleUpdateStatus(task.id, 'done')}>
                  Concluir
                </button>
              </div>
            ))}
        </div>
        <div>
          <h3>Concluídas</h3>
          {tasks
            .filter((t) => t.status === 'done')
            .map((task) => (
              <div key={task.id} className="task-card">
                <p>{task.description}</p>
                <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;