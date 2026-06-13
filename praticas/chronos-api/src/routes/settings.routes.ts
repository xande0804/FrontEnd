import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const settingsRouter = Router();

settingsRouter.get('/', async (_request, response) => {
  let settings = await prisma.settings.findUnique({
    where: {
      id: 1,
    },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: 1,
        workTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
      },
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

  const settings = await prisma.settings.upsert({
    where: {
      id: 1,
    },
    update: {
      workTime,
      shortBreakTime,
      longBreakTime,
    },
    create: {
      id: 1,
      workTime,
      shortBreakTime,
      longBreakTime,
    },
  });

  return response.json(settings);
}); 