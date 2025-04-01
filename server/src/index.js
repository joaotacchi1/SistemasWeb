const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
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
    // Se a senha estiver correta, retorne o ID do usuário) {
    res.json({ success: true, userId: user.id });
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
  const { description, deadline, assignedTo, observation, userId } = req.body;
  const task = await prisma.task.create({
    data: {
      description,
      deadline: new Date(deadline),
      assignedTo,
      observation,
      userId
    }
  });
  res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { description, deadline, assignedTo, observation, status } = req.body;
  const task = await prisma.task.update({
    where: { id: parseInt(id) },
    data: { description, deadline: new Date(deadline), assignedTo, observation, status }
  });
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id: parseInt(id) } });
  res.json({ success: true });
});

app.listen(3001, () => console.log('Server running on port 3001'));