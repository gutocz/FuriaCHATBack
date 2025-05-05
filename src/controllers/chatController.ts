import { Request, Response } from 'express';
import { translateMessage } from '../services/openaiService';
import { executeCommand } from '../services/commandsService';

export const chatController = async (req: Request, res: Response) => {
  const userMessage = req.body.message;
  const command = await translateMessage(userMessage);
  const response = await executeCommand(command);
  res.json({ response });
};
