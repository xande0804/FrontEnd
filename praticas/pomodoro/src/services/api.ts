import type { TaskModel } from '../models/TaskModel';

const API_URL = 'http://localhost:3333';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authData = sessionStorage.getItem('kratos-auth');

  if (!authData) {
    return headers;
  }

  const { token } = JSON.parse(authData);

  headers.Authorization = `Bearer ${token}`;

  return headers;
}

export async function getSettings() {
  const response = await fetch(`${API_URL}/settings`, {
    headers: getAuthHeaders(),
  });

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
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao salvar configurações');
  }

  return response.json();
}

export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Erro ao carregar tarefas');
  }

  return response.json();
}

export async function clearTasks() {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Erro ao limpar histórico');
  }
}

export async function createTask(task: TaskModel) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
    body: JSON.stringify({
      completeDate: new Date(completeDate).toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao concluir tarefa');
  }

  return response.json();
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Credenciais inválidas');
  }

  return response.json();
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.error ??
        'Erro ao criar usuário',
    );
  }

  return responseData;
}

export async function forgotPassword(
  email: string,
) {
  const response = await fetch(
    `${API_URL}/auth/forgot-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? 'Erro ao recuperar senha',
    );
  }

  return data;
}

export async function resetPassword(data: {
  token: string;
  password: string;
}) {
  const response = await fetch(
    `${API_URL}/auth/reset-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.error ??
        'Erro ao redefinir senha',
    );
  }

  return responseData;
}