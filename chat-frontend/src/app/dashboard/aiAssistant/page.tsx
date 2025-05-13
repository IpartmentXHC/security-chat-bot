// pages/ai-assistant/index.tsx
"use client";
import React from 'react';
import ChatBox from '@/components/AiAssistant/ChatBox';

const AiAssistantPage = () => {
  const targetId = 2; // 示例靶场 ID，根据实际情况传入

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl mb-4">大模型辅助学习</h2>
      <ChatBox targetId={targetId} />
    </div>
  );
};

export default AiAssistantPage;