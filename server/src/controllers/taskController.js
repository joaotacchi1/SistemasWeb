const prisma = require('../prismaClient');
const { calculatePingometer } = require('../utils/pingometro');

const getTasks = async (req, res) => {
  const tasks = await prisma.task.findMany();
  const tasksWithPingometer = tasks.map(task => ({
    ...task,
    pingometer: calculatePingometer(task.deadline, task.status),
  }));
  res.json(tasksWithPingometer);
};

const createTask = async (req, res) => {
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
    const taskWithPingometer = {
      ...task,
      pingometer: calculatePingometer(task.deadline, task.status),
    };
    res.json(taskWithPingometer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa', details: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { description, deadline, assignedTo, observation, status } = req.body;

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
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id: parseInt(id) } });
  res.json({ success: true });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };