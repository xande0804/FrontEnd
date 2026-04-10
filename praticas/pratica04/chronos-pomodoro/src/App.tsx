import { Home } from './pages/Home';
import { useState } from 'react';
import type { TaskStateModel } from './models/TaskStateModel';
import { TaskContextProvider } from './contexts/TaskContext/TaskContextProvider';

import './styles/theme.css';
import './styles/global.css';

const initialState: TaskStateModel = {
  tasks: [],
  secondsRemaining: 0,
  formattedSecondsRemaining: '00:00',
  activeTask: null,
  currentCycle: 0,
  config: {
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
  },
};

export function App() {
  // O estado REAL ainda está aqui, mas o Provider não está usando ele (ainda!)
  const [state, setState] = useState(initialState);

  return (
    // Usamos o nosso componente limpo e encapsulado
    <TaskContextProvider>
      <Home />
    </TaskContextProvider>
  );
}