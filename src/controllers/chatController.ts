import { Request, Response } from 'express';
import { translateMessage } from '../services/openaiService';

export const chatController = async (req: Request, res: Response) => {
  const userMessage = req.body.message;
  const command = await translateMessage(userMessage);
  res.json({ command });
};
