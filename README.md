CSI477 - Proposta de Trabalho Final
Discente: João Vitor Tacchi Martins Lanna - 20.2.8088

1. Tema
<p>O trabalho final tem como tema o desenvolvimento de um sistema em que faça o controle das tarefas que devem ser feitas na casa por calouros que acabaram de entrar em uma república estudantil. O objetivo desse tema é ter um controle mais fácil de quais tarefas precisam ser feitas, quando foram feitas, por quem foi feita (caso haja mais de um calouro). Considerando que a república já tenha a utilização de um quadro kanbam (de forma física), esse projeto também tem o objetivo de simular um quadro kanbam de maneira simples e tecnológica, mostrando uma tabela com as tarefas que devem ser feitas, quais tarefas já foram feitas, se está em andamento, entre outras funcionalidades</p>

2. Escopo
<p>Este projeto terá as seguintes funcionalidades:</p>

<ul>
  <li>Um sistema de login simples</li> 
  <li>Deverá ser possível adicionar novas tarefas, onde o usuário deve colocar a descrição da tarefa, data limite para fazer a tarefa, para quem a tarefa é designada e observação, caso tenha</li>
  <li>Deverá ser possível atualizar ou remover a tarefa, caso seja necessário</li>
  <li>Caso o calouro já tenha começado a tarefa, deve ser possível passar a tarefa para "em andamento"</li>
</ul>

3. Restrições
<p>Neste trabalho não serão considerados o dia e hora que o calouro pegou a tarefa. O sistema de login é apenas um meio para saber qual usuário está lançando as tarefas, mas não irá fazer discrepância entre níveis de login (por exemplo, todos as pessoas que tiverem acesso ao sistema poderam mexer em todas as funcionalidades dele). Além disso, o sistema não contará com filtros para tarefas repetidas, uma vez que podem ser criadas as mesmas tarefas mais de uma vez</p> 

4. Protótipo
<p>Protótipos para as páginas de login, inserção de tarefas e exibição de quais tarefas já existem foram elaborados na ferramenta de prototipagem do Figma, e podem ser encontrados nesse <a href='https://www.figma.com/design/zgKlS0zqUujgVEA5yQfaZs/Sistemas-web?node-id=0-1&t=aOKnUUY9OoR75d7Z-1'>link</a>. Lembrando que este é apenas um protótipo e pode sofrer alterações durante a execução do trabalho, tanto no seu protótipo quanto nas suas funcionalidades e restrições</p>

5. Inicialização
<p>Para fazer a inicializição do projeto, devemos seguir os seguintes passos</p>
<ol>
  <li>Abra 2 terminais na sua IDE (recomendado utilização do VSCode para maior facilidade)</li>
  <li>Em um terminal:</li>
    <ul>
      <li>Rode cd server</li>
      <li>Rode npm install para baixar as dependências</li>
      <li>Rode npx prisma migrate dev --name init para iniciar o banco de dados</li>
      <li>Rode npm run dev para iniciar o back-end</li>
    </ul>
  <li>No segundo terminal</li>
    <ul>
      <li>Rode cd cliente</li>
      <li>Rode cd web-vite</li>
      <li>Rode npm install para instalar dependências</li>
      <li>Rode npm run dev para iniciar o front-end</li>
    </ul>
</ol>
