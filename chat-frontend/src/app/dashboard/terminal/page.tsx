// pages/dashboard/terminal.tsx
"use client";
import TerminalContainer from '@/components/Terminal/TerminalContainer';
import { useState } from 'react';


export default function TerminalPage() {
  const [targetId, setTargetId] = useState<number | null>(2); // 示例 ID

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#1e1e1e', color: '#ffffff' }}>
      <h2>🎯 靶场终端 - Target ID: {targetId}</h2>
      <TerminalContainer targetId={targetId} />
    </div>
  );
}