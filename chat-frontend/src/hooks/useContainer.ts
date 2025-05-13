// hooks/useContainer.ts
import { useCallback } from 'react';
import api from '../lib/api';

export const useContainer = () => {
  const start = async (targetId: number) => {
    return await api.startContainer(targetId);
  };

  const stop = async (targetId: number) => {
    return await api.stopContainer(targetId);
  };

  const restart = async (targetId: number) => {
    return await api.restartContainer(targetId);
  };

  const reset = async (targetId: number) => {
    return await api.resetContainer(targetId);
  };
  const fetchAllContainers = useCallback( async () => {
    return await api.getAllContainers();
  },([]));

  return { start, stop, restart, reset,fetchAllContainers };
};