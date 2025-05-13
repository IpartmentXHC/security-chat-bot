// components/AiAssistant/ChatBox.tsx
import React, { useState } from 'react';
import { useAiChat } from '@/hooks/useAiHint';
import DynamicIcon from '@/components/Icon/DynamicIcon';

interface ChatBoxProps {
    targetId: number | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ targetId }) => {
    const {
        messages,
        loading,
        sendMessage,
        getHint,
        models,
        selectedModel,
        setSelectedModel,
    } = useAiChat({ targetId });

    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        sendMessage(inputValue);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <div className="p-4 max-w-3xl mx-auto border-gray-600">
                <h2 className="text-xl mb-4">大模型辅助学习</h2>
            
            <div className="flex flex-col h-180 bg-gray-800 rounded-lg overflow-hidden">
                {/* 消息列表 */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg: any, index: any) => (
                        <div
                            key={index}
                            className={`p-3 rounded-md ${msg.role === 'user' ? 'bg-blue-900 ml-auto' : 'bg-gray-700'}`}
                            style={{ maxWidth: '90%' }}
                        >
                            {msg.content}
                        </div>
                    ))}
                </div>

                {/* 操作栏 */}
                <div className="border-t border-gray-600 p-2 flex items-center gap-2">
                    {/* 模型选择下拉框 */}
                    <select
                        value={selectedModel ?? undefined}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                    >
                        {models.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.id}
                            </option>
                        ))}
                    </select>

                    {/* Hint 按钮 */}
                    <button
                        onClick={getHint}
                        disabled={!targetId || loading || !selectedModel}
                        className="text-sm px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition disabled:opacity-50"
                    >
                        <DynamicIcon name="lightbulb" /> 提示
                    </button>

                    {/* 输入框 */}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="输入问题..."
                        className="flex-1 bg-gray-700 text-white p-2 rounded focus:outline-none"
                        disabled={loading}
                    />

                    {/* 发送按钮 */}
                    <button
                        onClick={handleSend}
                        disabled={loading || !inputValue.trim()}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition disabled:opacity-50"
                    >
                        {loading ? <DynamicIcon name="spinner" /> : '发送'}
                    </button>
                </div>
            </div>
            </div>
        </>
    );
};

export default ChatBox;