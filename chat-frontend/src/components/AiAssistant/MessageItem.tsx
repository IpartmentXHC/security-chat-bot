// components/AiAssistant/MessageItem.tsx
import React from 'react';

interface MessageItemProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div
      className={`p-3 rounded-md ${
        message.role === 'user' ? 'bg-blue-900 text-right' : 'bg-gray-700'
      }`}
      style={{ maxWidth: '90%' }}
    >
      {message.content}
    </div>
  );
};

export default MessageItem;