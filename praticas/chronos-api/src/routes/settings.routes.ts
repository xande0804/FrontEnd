import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middlewares/authMiddleware';

export const settingsRouter = Router();

settingsRouter.use(authMiddleware);

settingsRouter.get('/', async (request, response) => {
  const settings = await prisma.settings.findUnique({
    where: {
      userId: request.userId,
    },
  });

  if (!settings) {
    return response.status(404).json({
      error: 'Configurações não encontradas',
    });
  }

  return response.json(settings);
});

settingsRouter.put('/', async (request, response) => {
  const { workTime, shortBreakTime, longBreakTime } = request.body;

  if (
    typeof workTime !== 'number' ||
    typeof shortBreakTime !== 'number' ||
    typeof longBreakTime !== 'number'
  ) {
    return response.status(400).json({
      error: 'workTime, shortBreakTime e longBreakTime devem ser números',
    });
  }

  const settings = await prisma.settings.update({
    where: {
      userId: request.userId,
    },
    data: {
      workTime,
      shortBreakTime,
      longBreakTime,
    },
  });

  return response.json(settings);
});