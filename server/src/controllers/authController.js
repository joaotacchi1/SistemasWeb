const prisma = require('../prismaClient');

const register = async (req, res) => {
  const { username, password } = req.body;

  // Converte para maiúsculas
  const upperUsername = username.toUpperCase();
  const upperPassword = password.toUpperCase();

  const existingUser = await prisma.user.findUnique({ where: { username: upperUsername } });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Username já existe' });
  }

  try {
    const user = await prisma.user.create({
      data: {
        username: upperUsername,
        password: upperPassword, // Senha em texto simples
      },
    });
    res.json({ success: true, username: user.username });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário', details: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  // Converte para maiúsculas
  const upperUsername = username.toUpperCase();
  const upperPassword = password.toUpperCase();

  const user = await prisma.user.findUnique({ where: { username: upperUsername } });

  if (user && user.password === upperPassword) {
    res.json({ success: true, username: user.username });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
};

module.exports = { register, login };