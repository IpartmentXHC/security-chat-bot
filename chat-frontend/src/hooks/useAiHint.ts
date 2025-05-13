// hooks/useAiChat.ts
import api from '../lib/api';
import { useEffect, useState } from 'react';

interface UseAiChatProps {
  targetId: number | null;
}

export const useAiChat = ({ targetId }: UseAiChatProps) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // 获取模型列表
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await api.getChatModels();
        setModels(res.data);
        if (res.data.length > 0) {
          setSelectedModel(res.data[0].id); // 默认选择第一个模型
        }
      } catch (e) {
        console.error('Failed to fetch models:', e);
      }
    };

    fetchModels();
  }, []);

  // 获取 Hint 提示
  const getHint = async () => {
    if (!targetId || !selectedModel) return;

    setLoading(true);
    try {
      const res = await api.getHint(targetId, '请给我一些关于这个靶场的提示');
      const responseText = typeof res === 'string' ? res : JSON.stringify(res);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: responseText },
      ]);
    } catch (e) {
      alert('获取提示失败');
    } finally {
      setLoading(false);
    }
  };

  // 发送用户问题给大模型
  const sendMessage = async (question: string) => {
    if (!question.trim() || !selectedModel) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const res = await api.sendChatMessage({
        model: selectedModel,
        messages: [{ role: 'user', content: question }],
      });
      const responseText = typeof res === 'string' ? res : JSON.stringify(res);
      setMessages((prev) => [...prev, { role: 'assistant', content: responseText }]);
    } catch (e) {
      alert('回答生成失败');
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    getHint,
    models,
    selectedModel,
    setSelectedModel,
  };
};