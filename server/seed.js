const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedWithEncryption() {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.createManyAndReturn({
    data: [
      {
        username: "admin",
        password: "123456",
      },
      {
        username: "sadia",
        password: "123",
      },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        description: "Lavar a louça",
        deadline: new Date("2025-04-05"),
        assignedTo: "João",
        observation: "Usar detergente",
        status: "to_do",
        userUsername: user[0].username,
      },
      {
        description: "Limpar o banheiro",
        deadline: new Date("2025-04-07"),
        assignedTo: "Maria",
        observation: "",
        status: "in_progress",
        userUsername: user[1].username,
      },
      {
        description: "Varrer a sala",
        deadline: new Date("2025-04-03"),
        assignedTo: "Pedro",
        observation: "Feito na semana passada",
        status: "done",
        userUsername: user[1].username,
      },
    ],
  });

  console.log("Usuário e tarefas criados!");
  await prisma.$disconnect();
}

seedWithEncryption().catch((e) => {
  console.error(e);
  process.exit(1);
});
