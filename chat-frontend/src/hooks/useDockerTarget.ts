// hooks/useDockerTarget.ts
import { useCallback } from 'react';
import api from '../lib/api';

export const useDockerTarget = () => {
  const fetchAllTargets =useCallback(async () => {
    return await api.getAllTargets();
  },[]);
  const createNewTarget = async (data: any) => {
    return await api.createTarget(data);
  };

  const fetchTargetById = async (id: number) => {
    return await api.getTargetById(id);
  };

  const updateExistingTarget = async (id: number, data: any) => {
    return await api.updateTarget(id, data);
  };

  const deleteTarget = async (id: number) => {
    return await api.deleteTarget(id);
  };

  return {
    fetchAllTargets,
    createNewTarget,
    fetchTargetById,
    updateExistingTarget,
    deleteTarget,
  };
};