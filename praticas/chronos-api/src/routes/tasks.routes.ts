import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const tasksRouter = Router();

tasksRouter.post('/', async (request, response) => {
    const { id, name, duration, type, startDate } = request.body;
  
    if (
      !id ||
      !name ||
      typeof duration !== 'number' ||
      !type ||
      !startDate
    ) {
      return response.status(400).json({
        error: 'Dados inválidos',
      });
    }
  
    try {
      const task = await prisma.task.create({
        data: {
          id,
          name,
          duration,
          type,
          startDate: new Date(startDate),
        },
      });
  
      return response.status(201).json(task);
    } catch {
      return response.status(409).json({
        error: 'Task já existe',
      });
    }
});

tasksRouter.get('/', async (_request, response) => {
    const tasks = await prisma.task.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });
  
    return response.json(tasks);
});

tasksRouter.patch('/:id/complete', async (request, response) => {
    const { id } = request.params;
    const { completeDate } = request.body;
  
    if (!completeDate) {
      return response.status(400).json({
        error: 'completeDate é obrigatório',
      });
    }
  
    try {
      const task = await prisma.task.update({
        where: {
          id,
        },
        data: {
          completeDate: new Date(completeDate),
        },
      });
  
      return response.json(task);
    } catch {
      return response.status(404).json({
        error: 'Task não encontrada',
      });
    }
});

tasksRouter.patch('/:id/interrupt', async (request, response) => {
    const { id } = request.params;
    const { interruptDate } = request.body;
  
    if (!interruptDate) {
      return response.status(400).json({
        error: 'interruptDate é obrigatório',
      });
    }
  
    try {
      const task = await prisma.task.update({
        where: {
          id,
        },
        data: {
          interruptDate: new Date(interruptDate),
        },
      });
  
      return response.json(task);
    } catch {
      return response.status(404).json({
        error: 'Task não encontrada',
      });
    }
});

tasksRouter.delete('/', async (_request, response) => {
    await prisma.task.deleteMany();
  
    return response.status(204).send();
});