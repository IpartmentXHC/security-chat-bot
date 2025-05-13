// components/Terminal/TerminalContainer.tsx
"use client";
import React, { useEffect, useState } from 'react';
import useTerminalWebSocket from '../../hooks/useTerminalWebSocket';
import InputBox from './InputBox';
import styles from './terminal.module.css';

interface TerminalContainerProps {
  targetId: number | null;
}

const TerminalContainer: React.FC<TerminalContainerProps> = ({ targetId }) => {
  const { isConnected, terminalOutput, sendCommand, clearOutput, error } = useTerminalWebSocket({ targetId });

  // 格式化终端输出
  const formattedOutput = terminalOutput.map((line, index) => {
    if (line.startsWith('[CMD]')) {
      return <span key={index} className={`${styles.terminal_output} ${styles.command}`}>{line.replace('[CMD]', '\n')}</span>;
    } else if (line.startsWith('[OUTPUT][ERROR]')) {
      return <span key={index} className={`${styles.terminal_output} ${styles.error}`}>{line.replace('[ERROR]', '')}</span>;
    } else if (line.startsWith('[OUTPUT]')) {
      return <span key={index} className={`${styles.terminal_output} ${styles.output}`}>{line.replace('[OUTPUT]', '')}</span>;
    } else {
      return <span key={index} className={styles.terminal_output}>{line}</span>;
    }
  });

  return (
    <div className="bg-[#2D2D2D] p-3 flex justify-between">
      <div>
        <div className="flex  space-x-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-terminal-text text-sm">终端</span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto terminal-font text-terminal-text">
          <div className={styles.terminal}>
            <div className={styles.terminal_container}>
              {formattedOutput}
            </div>
            <InputBox onSend={sendCommand} />
            {!isConnected && <p style={{ color: 'red' }}>⚠️ 当前未连接终端 - {error || '正在尝试重新连接...'}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalContainer;