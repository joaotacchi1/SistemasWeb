const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Usar as rotas
app.use(authRoutes);
app.use(taskRoutes);

app.listen(3001, () => console.log('Server running on port 3001'));