// hooks/useChat.ts
import api from '../lib/api';

export const useChat = () => {
  const sendMessage = async (requestBody: any) => {
    return await api.sendChatMessage(requestBody);
  };

  const getModels = async () => {
    return await api.getChatModels();
  };

  return { sendMessage, getModels };
};