const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seed() {
    await prisma.user.deleteMany();
  // Criar usuário
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      password: '123456',
    },
  });

  // Inserir tarefas
  await prisma.task.createMany({
    data: [
      {
        description: 'Lavar a louça',
        deadline: new Date('2025-04-05'),
        assignedTo: 'João',
        observation: 'Usar detergente neutro',
        status: 'to_do',
        userId: user.id,
      },
      {
        description: 'Limpar o banheiro',
        deadline: new Date('2025-04-07'),
        assignedTo: 'Maria',
        status: 'in_progress',
        userId: user.id,
      },
      {
        description: 'Varrer a sala',
        deadline: new Date('2025-04-03'),
        assignedTo: 'Pedro',
        observation: 'Feito na semana passada',
        status: 'done',
        userId: user.id,
      },
    ],
  });

  console.log('Usuário e tarefas criados com sucesso!');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});