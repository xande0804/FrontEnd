import { useEffect, useReducer, useRef } from 'react';
import type { TaskModel } from '../../models/TaskModel';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';
import { getSettings, getTasks, completeTask } from '../../services/api';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    const storageState = localStorage.getItem('state');

    if (storageState === null) return initialTaskState;

    const parsedStorageState = JSON.parse(storageState) as TaskStateModel;

    return {
      ...parsedStorageState,
      activeTask: null,
      secondsRemaining: 0,
      formattedSecondsRemaining: '00:00',
    };
  });

  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);

  const worker = TimerWorkerManager.getInstance();

  useEffect(() => {
    worker.onmessage(e => {
      const countDownSeconds = e.data;
  
      if (countDownSeconds <= 0) {
        async function finishTask() {
          if (playBeepRef.current) {
            playBeepRef.current();
            playBeepRef.current = null;
          }
  
          if (state.activeTask) {
            try {
              await completeTask(state.activeTask.id, Date.now());
            } catch (error) {
              console.error(error);
            }
          }
  
          dispatch({
            type: TaskActionTypes.COMPLETE_TASK,
          });
  
          worker.terminate();
        }
  
        finishTask();
      } else {
        dispatch({
          type: TaskActionTypes.COUNT_DOWN,
          payload: { secondsRemaining: countDownSeconds },
        });
      }
    });
  }, [worker, state.activeTask]);

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));

    if (!state.activeTask) {
      worker.terminate();
    }

    document.title = `${state.formattedSecondsRemaining} - Kratos Pomodoro`;

    worker.postMessage(state);
  }, [worker, state]);

  useEffect(() => {
    if (state.activeTask && playBeepRef.current === null) {
      playBeepRef.current = loadBeep();
    } else {
      playBeepRef.current = null;
    }
  }, [state.activeTask]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSettings();

        dispatch({
          type: TaskActionTypes.CHANGE_SETTINGS,
          payload: {
            workTime: settings.workTime,
            shortBreakTime: settings.shortBreakTime,
            longBreakTime: settings.longBreakTime,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    async function loadTasks() {
      try {
        const tasks = await getTasks();

        const parsedTasks = tasks.map((task: {
          id: string;
          name: string;
          duration: number;
          type: TaskModel['type'];
          startDate: string;
          completeDate: string | null;
          interruptDate: string | null;
        }) => ({
          ...task,
          startDate: new Date(task.startDate).getTime(),
          completeDate: task.completeDate
            ? new Date(task.completeDate).getTime()
            : null,
          interruptDate: task.interruptDate
            ? new Date(task.interruptDate).getTime()
            : null,
        }));

        dispatch({
          type: TaskActionTypes.LOAD_TASKS,
          payload: parsedTasks,
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}