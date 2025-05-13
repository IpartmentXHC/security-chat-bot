"use client"
import React, { useState } from 'react'
import TerminalContainer from '@/components/Terminal/TerminalContainer';
import Sidebar from '@/components/TargetList/Sidebar';
import ChatBox from '@/components/AiAssistant/ChatBox';
const index = () => {

  const [targetId, setTargetId] = useState<number | null>(0); // 示例 ID
  return (
    <div className="flex justify-center items-center p-8" style={{ minHeight: '1024px', backgroundColor: '#1E1E1E' }}>
      <div className="w-[1440px] h-[800px] flex bg-terminal rounded-lg overflow-hidden shadow-2xl">
        <Sidebar onSelectTarget={(id) => setTargetId(id)} />
        <TerminalContainer targetId={targetId} />
        <ChatBox targetId={targetId} />
      </div>
    </div>
  )

}

export default index;