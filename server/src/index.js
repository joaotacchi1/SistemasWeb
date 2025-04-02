const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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

// CRUD Tarefas
app.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { description, deadline, assignedTo, observation, userUsername } = req.body;
  const task = await prisma.task.create({
    data: {
      description,
      deadline: new Date(deadline),
      assignedTo,
      observation,
      userUsername,
    },
  });
  res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Apenas status é necessário
  try {
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status }, // Atualiza apenas o status
    });
    res.json(task);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id: parseInt(id) } });
  res.json({ success: true });
});

app.listen(3001, () => console.log('Server running on port 3001'));