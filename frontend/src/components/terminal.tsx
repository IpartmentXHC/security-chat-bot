// components/TerminalComponent.tsx
"use client";

import React, { useEffect, useRef } from "react";

interface TerminalProps {
  containerId: number | string;
}

export default function TerminalComponent({ containerId }: TerminalProps) {
  const outputRef = useRef<HTMLPreElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  const sendCommand = () => {
    const input = inputRef.current;
    const command = input?.value.trim();

    if (command &&input!=null&& wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(command);
      input.value = "";
      if (outputRef.current) {
        outputRef.current.innerText += `\n$ ${command}\n`;
        scrollToBottom();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendCommand();
    }
  };

  useEffect(() => {
    if (!containerId) return;

    const wsUrl = `ws://192.168.1.160:8000/api/terminal/${containerId}`;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      if (outputRef.current) {
        outputRef.current.innerText += "Connected to container...\n";
        scrollToBottom();
      }
    };

    socket.onmessage = (event) => {
      if (outputRef.current) {
        outputRef.current.innerText += event.data;
        scrollToBottom();
      }
    };

    socket.onclose = () => {
      if (outputRef.current) {
        outputRef.current.innerText += "\nConnection closed.\n";
        scrollToBottom();
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      if (outputRef.current) {
        outputRef.current.innerText += `\nWebSocket error: ${JSON.stringify(err)}\n`;
        scrollToBottom();
      }
    };

    return () => {
      socket.close();
    };
  }, [containerId]);

  return (
    <div className="w-[600px] border-r border-gray-700 flex flex-col">
      {/* 终端界面保持不变 */}
      <div className="bg-[#2D2D2D] p-3 flex items-center space-x-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-terminal-text text-sm">终端</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto terminal-font text-terminal-text">
        <pre
          ref={outputRef}
          className="m-0 text-terminal-text font-mono text-sm whitespace-pre-wrap break-all"
          style={{
            minHeight: "calc(100% - 54px)",
            maxHeight: "calc(100% - 54px)",
            overflowY: "auto",
          }}
        ></pre>

        <div className="mt-2 pt-2 border-t border-gray-700">
          <input
            ref={inputRef}
            type="text"
            placeholder="输入命令..."
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-terminal-text outline-none terminal-font text-sm"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}