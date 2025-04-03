const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Função para calcular o pingômetro
const calculatePingometer = (deadline, status) => {
  if (status === 'done') return 0; // Se a tarefa está concluída, o pingômetro é 0

  const now = new Date();
  const deadlineDate = new Date(deadline);

  // Se o prazo ainda não passou, o pingômetro é 0
  if (now <= deadlineDate) return 0;

  // Calcula a diferença em horas
  const diffInMs = now - deadlineDate;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Converte milissegundos para horas

  return diffInHours; // 1 dose por hora de atraso
};

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  
  if (user && await password === user.password) {
    res.json({ success: true, username: user.username });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

//Registro de usuário
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Verifica se o username já existe
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Username já existe' });
  }

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password,
      },
    });
    res.json({ success: true, username: user.username });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário', details: error.message });
  }
});

// CRUD Tarefas
app.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany();
  // Adiciona o pingômetro a cada tarefa
  const tasksWithPingometer = tasks.map(task => ({
    ...task,
    pingometer: calculatePingometer(task.deadline, task.status),
  }));
  res.json(tasksWithPingometer);
});

app.post('/tasks', async (req, res) => {
  const { description, deadline, assignedTo, observation, userUsername } = req.body;

  const user = await prisma.user.findUnique({ where: { username: userUsername } });
  if (!user) {
    return res.status(400).json({ error: `Usuário com username '${userUsername}' não encontrado` });
  }

  try {
    const task = await prisma.task.create({
      data: {
        description,
        deadline: new Date(deadline),
        assignedTo,
        observation,
        userUsername,
      },
    });
    // Adiciona o pingômetro à tarefa recém-criada
    const taskWithPingometer = {
      ...task,
      pingometer: calculatePingometer(task.deadline, task.status),
    };
    res.json(taskWithPingometer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa', details: error.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { description, deadline, assignedTo, observation, status } = req.body;

  // Construir o objeto data dinamicamente, incluindo apenas os campos fornecidos
  const data = {};
  if (description !== undefined) data.description = description;
  if (deadline !== undefined) data.deadline = new Date(deadline);
  if (assignedTo !== undefined) data.assignedTo = assignedTo;
  if (observation !== undefined) data.observation = observation;
  if (status !== undefined) data.status = status;

  try {
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data,
    });
    const taskWithPingometer = {
      ...task,
      pingometer: calculatePingometer(task.deadline, task.status),
    };
    res.json(taskWithPingometer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa', details: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id: parseInt(id) } });
  res.json({ success: true });
});

app.listen(3001, () => console.log('Server running on port 3001'));