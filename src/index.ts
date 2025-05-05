import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat';
import { updateFuriaCache } from './services/cacheService';

const app = express();
const PORT = process.env.PORT || 3001;

// Atualiza ao iniciar
updateFuriaCache();

// Atualiza a cada 1 hora
setInterval(() => {
  updateFuriaCache();
}, 60 * 60 * 1000); // 1h

app.use(cors({
  origin: ['http://localhost:5173', 'https://furia-chat-front.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Chatbot está online 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
