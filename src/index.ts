import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Chatbot está online 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
