// components/Terminal/InputBox.tsx
import { useEffect, useRef, useState } from 'react';

interface InputBoxProps {
  onSend: (command: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ onSend }) => {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]); // 命令历史
  const [currentIndex, setCurrentIndex] = useState(-1); // 当前历史索引
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        onSend(inputValue);
        setHistory((prev) => [inputValue, ...prev]);
        setCurrentIndex(-1);
        setInputValue('');
      }
    } else if (e.key === 'ArrowUp') {
      // 向上键：切换到上一条命令
      if (currentIndex < history.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setInputValue(history[currentIndex + 1] || '');
      }
    } else if (e.key === 'ArrowDown') {
      // 向下键：切换到下一条命令
      if (currentIndex > -1) {
        setCurrentIndex((prev) => prev - 1);
        setInputValue(history[currentIndex - 1] || '');
      } else {
        setInputValue('');
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        id="cmd-input"
        type="text"
        placeholder="输入命令..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          flex: 1,
          padding: '5px',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          border: '1px solid #444',
        }}
      />
      <button
        onClick={() => onSend(inputValue)}
        disabled={!inputValue.trim()}
        style={{
          padding: '5px 10px',
          backgroundColor: '#28a745',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        发送
      </button>
    </div>
  );
};

export default InputBox;