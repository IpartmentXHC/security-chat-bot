// components/TargetListSidebar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Icon from '@/components/dynamicIcon';

interface Target {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface ApiResponse {
  data: Target[];
}

interface Props {
  onSelectTarget: (target: Target) => void;
  selectedTargetId: number | null;
  runningTargets: Set<number>;
}

export default function TargetListSidebar({
  onSelectTarget,
  selectedTargetId,
  runningTargets,
}: Props) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取靶场数据
  useEffect(() => {
    async function fetchTargets() {
      try {
        const res = await fetch("http://192.168.1.160:8000/api/docker/targets/");
        if (!res.ok) throw new Error(`网络错误：${res.status} ${res.statusText}`);

        const data: ApiResponse = await res.json();
        setTargets(data.data);
      } catch (err) {
        console.error("获取靶场列表失败:", err);
        setError("无法加载靶场列表");
      } finally {
        setLoading(false);
      }
    }

    fetchTargets();
  }, []);

  // 按分类分组
  const groupedTargets = targets.reduce<Record<string, Target[]>>(
    (acc, target) => {
      acc[target.category] = acc[target.category] || [];
      acc[target.category].push(target);
      return acc;
    },
    {}
  );

  // 加载状态
  if (loading) {
    return (
      <div className="w-[240px] border-r border-gray-700 flex flex-col">
        <div className="bg-[#2D2D2D] p-3">
          <span className="text-terminal-text text-sm">靶场列表</span>
        </div>
        <div className="flex-1 p-4 text-gray-500 text-sm">加载中...</div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="w-[240px] border-r border-gray-700 flex flex-col">
        <div className="bg-[#2D2D2D] p-3">
          <span className="text-terminal-text text-sm">靶场列表</span>
        </div>
        <div className="flex-1 p-4 text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-[240px] border-r border-gray-700 flex flex-col">
      {/* 标题 */}
      <div className="bg-[#2D2D2D] p-3">
        <span className="text-terminal-text text-sm">靶场列表</span>
      </div>

      {/* 分类列表 */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedTargets).map(([category, items]) => (
          <div key={category} className="p-2">
            <div className="text-gray-400 text-sm mb-2 capitalize">
              {category}
            </div>
            <div className="space-y-1">
              {items.map((target) => {
                const isRunning = runningTargets.has(target.id);
                const isSelected = selectedTargetId === target.id;
                return (
                  <button
                    key={target.id}
                    className={`w-full text-left p-2 text-terminal-text text-sm rounded transition-colors whitespace-nowrap flex items-center justify-between ${isSelected
                        ? "bg-[#2D2D2D]"
                        : "hover:bg-[#2D2D2D] hover:text-white"
                      } `}
                    title={target.description}
                    onClick={() => onSelectTarget(target)}
                  >
                    <span>{target.name}</span>
                    {isRunning && (
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* 空状态 */}
        {Object.keys(groupedTargets).length === 0 && (
          <div className="p-4 text-gray-500 text-sm">暂无靶场</div>
        )}
      </div>

      {/* 底部按钮（可选） */}
      {/* <div className="p-3 border-t border-gray-700 flex gap-2">
        <button className="flex-[2] bg-green-700 text-white p-2 !rounded-button flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors whitespace-nowrap">
          启动靶场
        </button>
        <button className="flex-1 bg-gray-700 text-white p-2 !rounded-button flex items-center justify-center space-x-2 hover:bg-gray-600 transition-colors whitespace-nowrap">
          上传
        </button>
      </div> */}
      <div className="p-3 border-t border-gray-700">
        <div className="relative">
          <input type="text" placeholder="搜索靶场..." className="w-full bg-[#2D2D2D] text-terminal-text p-2 pl-8 !rounded-button border-none text-sm" />
          <Icon name="faSearch" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  );
}