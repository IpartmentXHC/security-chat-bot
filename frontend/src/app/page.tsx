"use client";
import React from 'react';
import {useState,useCallback} from 'react';
import * as echarts from 'echarts';
import Icon from '@/components/dynamicIcon';
import TerminalComponent from "@/components/terminal";
import TargetListSidebar from "@/components/targetListSidebar";

export default function Home() {
  const [selectedTarget, setSelectedTarget] = useState<{ id: number } | null>(null);
  const [runningTargets, setRunningTargets] = useState<Set<number>>(new Set());
  const handleSelectTarget = useCallback(
    (target: { id: number }) => {
      setSelectedTarget(target);
      setRunningTargets((prev) => {
        const next = new Set(prev);
        next.add(target.id);
        return next;
      });
    },
    []
  );
  return (
    <div className="flex justify-center items-center p-8" style={{ minHeight: '1024px', backgroundColor: '#1E1E1E' }}>
      <div className="w-[1440px] h-[800px] flex bg-terminal rounded-lg overflow-hidden shadow-2xl">
      {/* Sidebar */}
      <TargetListSidebar
        onSelectTarget={handleSelectTarget}
        selectedTargetId={selectedTarget?.id ?? null}
        runningTargets={runningTargets}
      />

      {/* Terminal */}
      <TerminalComponent containerId={selectedTarget?.id ?? "4"} />
        {/* Right Panel */}
        <div className="flex-1 flex flex-col bg-[#252525]">
          <div className="p-4">
            <div className="bg-[#2D2D2D] p-4 rounded-lg mb-4">
              <div className="mb-4 border-b border-gray-700 pb-4">
                <div className="text-gray-400 text-sm mb-2">AI 响应：</div>
                <div className="text-terminal-text">
                  根据您提供的命令历史，我建议您可以通过以下步骤继续操作：<br />
                  1. 检查当前的更改内容<br />
                  2. 确认需要提交的文件<br />
                  3. 完成代码提交
                </div>
              </div>
              <div className="mb-4 border-b border-gray-700 pb-4">
                <div className="text-gray-400 text-sm mb-2">智能助手建议：</div>
                <div className="text-terminal-text">
                  1. 使用 git add . 添加所有更改<br />
                  2. git commit -m "描述你的更改"<br />
                  3. git push origin master
                </div>
              </div>
              <div className="relative">
                <textarea
                  className="w-full h-32 bg-[#333] text-terminal-text p-3 rounded-lg resize-none terminal-font text-sm"
                  placeholder="输入您的问题..."
                ></textarea>
                <button className="absolute bottom-3 right-3 bg-primary text-white px-4 py-2 !rounded-button flex items-center space-x-2 hover:bg-secondary transition-colors whitespace-nowrap">
                  <Icon name="faPaperPlane" />
                  <span>发送</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#2D2D2D] p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-400 text-sm">今日任务日历</div>
                  <button className="text-gray-400 hover:text-white transition-colors !rounded-button whitespace-nowrap">

                    <Icon name="faExpandAlt" />
                  </button>
                </div>
                <div className="text-terminal-text mb-3 text-center pb-2 border-b border-gray-700">
                  <div className="text-lg">2024年1月18日</div>
                  <div className="text-sm text-gray-400">星期四</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 bg-[#333] p-2 rounded">

                    <Icon name="faClock" className="text-yellow-500" />
                    <span className="text-terminal-text text-sm">09:30 SQL注入原理学习</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-[#333] p-2 rounded">

                    <Icon name="faTasks" className="text-blue-500" />
                    <span className="text-terminal-text text-sm">14:00 XSS漏洞实战演练</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#2D2D2D] p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-400 text-sm">知识图谱</div>
                  <button className="text-gray-400 hover:text-white transition-colors !rounded-button whitespace-nowrap">

                    <Icon name="faExpandAlt" />
                  </button>
                </div>
                {/* <div className="h-[150px] relative" ref={chartRef}></div> */}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
