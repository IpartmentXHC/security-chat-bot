// lib/api.ts

import axios from 'axios';

// ========================
// 🔧 后端地址配置
// ========================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 120000,
});

// 统一错误处理函数
const handleApiError = (error: any): never => {
  if (error.response) {
    const message = error.response.data.detail || error.message;
    throw new Error(message);
  } else if (error.request) {
    throw new Error('No response received from server.');
  } else {
    throw new Error(`Request failed: ${error.message}`);
  }
};

// ========================
// 🔌 API 导出
// ========================

export default {
  // Chat APIs
  getChatModels: async () => {
    try {
      const res = await apiClient.get('/chat/');
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  sendChatMessage: async (requestBody: any) => {
    try {
      const res = await apiClient.post('/chat/completions', requestBody);
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  getHint: async (targetId: number, question: string) => {
    try {
      const res = await apiClient.post(`/chat/hint`, null, {
        params: { target_id: targetId, question },
      });
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  generateStudyPlan: async (topic: string) => {
    try {
      const res = await apiClient.post(`/chat/study-plan`, null, {
        params: { topic },
      });
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  getKnowledgeGraph: async (targetId: number) => {
    try {
      const res = await apiClient.post(`/chat/knowledge-graph`, null, {
        params: { target_id: targetId },
      });
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },

  // Docker Target APIs
  getAllTargets: async () => {
    try {
      const res = await apiClient.get('/docker/targets/');
      return res.data.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  createTarget: async (data: any) => {
    try {
      const res = await apiClient.post('/docker/targets/', data);
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  getTargetById: async (targetId: number) => {
    try {
      const res = await apiClient.get(`/docker/targets/${targetId}`);
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  updateTarget: async (targetId: number, data: any) => {
    try {
      const res = await apiClient.put(`/docker/targets/${targetId}`, data);
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  deleteTarget: async (targetId: number) => {
    try {
      const res = await apiClient.delete(`/docker/targets/${targetId}`);
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },

  // Container Control APIs
  getAllContainers: async () => {
    try {
      const res = await apiClient.get('/container/');
      return res.data.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  getContainerByTarget: async (targetId: number) => {
    try {
      const res = await apiClient.get(`/container/${targetId}`);
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  startContainer: async (targetId: number) => {
    try {
      const res = await apiClient.post(`/container/start/${targetId}`);
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  stopContainer: async (targetId: number) => {
    try {
      const res = await apiClient.post(`/container/stop/${targetId}`);
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  restartContainer: async (targetId: number) => {
    try {
      const res = await apiClient.post(`/container/restart/${targetId}`);
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
  resetContainer: async (targetId: number) => {
    try {
      const res = await apiClient.post(`/container/reset/${targetId}`);
      return res.data;
    } catch (e) {
      handleApiError(e);
    }
  },
};

// ========================
// 🔗 导出 WebSocket 地址
// ========================
export { WS_BASE_URL };