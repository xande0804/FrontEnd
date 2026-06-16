import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const authRouter = Router();

authRouter.post('/register', async (request, response) => {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response.status(400).json({
      error: 'Dados inválidos',
    });
  }

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userAlreadyExists) {
    return response.status(409).json({
      error: 'E-mail já cadastrado',
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      settings: {
        create: {
          workTime: 25,
          shortBreakTime: 5,
          longBreakTime: 15,
        },
      },
    },
  });

  return response.status(201).json({
    message: 'Usuário criado com sucesso',
    userId: user.id,
  });
});

authRouter.post('/login', async (request, response) => {
    const { email, password } = request.body;
  
    if (!email || !password) {
      return response.status(400).json({
        error: 'Dados inválidos',
      });
    }
  
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  
    if (!user) {
      return response.status(401).json({
        error: 'Credenciais inválidas',
      });
    }
  
    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash,
    );
  
    if (!passwordMatch) {
      return response.status(401).json({
        error: 'Credenciais inválidas',
      });
    }
  
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '7d',
      },
    );
  
    return response.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
});

authRouter.post('/forgot-password', async (request, response) => {
    const { email } = request.body;
  
    if (!email) {
      return response.status(400).json({
        error: 'Email é obrigatório',
      });
    }
  
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  
    if (!user) {
      return response.status(404).json({
        error: 'Usuário não encontrado',
      });
    }
  
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    const expiresAt = new Date(
      Date.now() + 1000 * 60 * 60,
    );
  
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        expiresAt,
        userId: user.id,
      },
    });
  
    return response.json({
      resetToken,
    });
});

authRouter.post('/reset-password', async (request, response) => {
    const { token, password } = request.body;
  
    if (!token || !password) {
      return response.status(400).json({
        error: 'Token e senha são obrigatórios',
      });
    }
  
    const passwordResetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          token,
        },
      });
  
    if (!passwordResetToken) {
      return response.status(400).json({
        error: 'Token inválido',
      });
    }
  
    if (passwordResetToken.expiresAt < new Date()) {
      return response.status(400).json({
        error: 'Token expirado',
      });
    }
  
    const passwordHash = await bcrypt.hash(password, 10);
  
    await prisma.user.update({
      where: {
        id: passwordResetToken.userId,
      },
      data: {
        passwordHash,
      },
    });
  
    await prisma.passwordResetToken.delete({
      where: {
        id: passwordResetToken.id,
      },
    });
  
    return response.json({
      message: 'Senha redefinida com sucesso',
    });
});