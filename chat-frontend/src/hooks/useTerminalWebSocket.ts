// hooks/useTerminalWebSocket.ts
"use client";
import { useEffect, useRef, useState } from 'react';
import { WS_BASE_URL } from '../lib/api'; // 引入配置好的 WebSocket 地址

interface UseTerminalWebSocketProps {
  targetId: number | null;
  autoConnect?: boolean;
}

const useTerminalWebSocket = ({ targetId, autoConnect = true }: UseTerminalWebSocketProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const sendCommand = (command: string) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(command);
      setTerminalOutput((prev) => [...prev, `[CMD] $ ${command} \n`]);
    }
  };

  const clearOutput = () => {
    setTerminalOutput([]);
  };

  useEffect(() => {
    if (!targetId || !autoConnect) return;

    const wsUrl = `${WS_BASE_URL}/api/terminal/${targetId}`;
    const ws = new WebSocket(wsUrl);

    console.log('Connecting to WebSocket:', wsUrl); // 调试用

    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      setTerminalOutput((prev) => [...prev, '[终端已连接]']);
    };

    ws.onmessage = (event) => {
      const message = event.data;
      setTerminalOutput((prev) => [...prev, `[OUTPUT]${message}`]);
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      if (event.reason) {
        setError(event.reason);
      }
      setTerminalOutput((prev) => [...prev, `[连接已关闭: code ${event.code}]`]);
    };

    ws.onerror = (err) => {
      console.error('WebSocket Error:', err);
      setError('WebSocket 连接异常');
      ws.close();
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [targetId, autoConnect]);

  return {
    isConnected,
    terminalOutput,
    sendCommand,
    clearOutput,
    error,
    ws: wsRef.current,
  };
};

export default useTerminalWebSocket;