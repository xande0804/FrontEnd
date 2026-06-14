import type { TaskModel } from '../models/TaskModel';

const API_URL = 'http://localhost:3333';

export async function getSettings() {
  const response = await fetch(`${API_URL}/settings`);

  if (!response.ok) {
    throw new Error('Erro ao carregar configurações');
  }

  return response.json();
}

export async function updateSettings(data: {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
}) {
  const response = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao salvar configurações');
  }

  return response.json();
}

export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error('Erro ao carregar tarefas');
  }

  return response.json();
}

export async function clearTasks() {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Erro ao limpar histórico');
  }
}

export async function createTask(task: TaskModel) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar tarefa');
  }

  return response.json();
}

export async function interruptTask(
  id: string,
  interruptDate: number,
) {
  const response = await fetch(`${API_URL}/tasks/${id}/interrupt`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      interruptDate: new Date(interruptDate).toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao interromper tarefa');
  }

  return response.json();
}

export async function completeTask(
  id: string,
  completeDate: number,
) {
  const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      completeDate: new Date(completeDate).toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao concluir tarefa');
  }

  return response.json();
}