// components/TargetList/Sidebar.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useDockerTarget } from '../../hooks/useDockerTarget';
import { useContainer } from '../../hooks/useContainer';
import SearchBar from './SearchBar';
import DynamicIcon from '@/components/Icon/DynamicIcon';

interface Target {
  id: number;
  name: string;
  description: string;
  category: string;
  isRunning: boolean;
}
interface SidebarProps {
  onSelectTarget: (id: number) => void; // 新增的回调函数
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectTarget }) => {
  const { fetchAllTargets } = useDockerTarget();
  const { start, stop, fetchAllContainers } = useContainer();
  const [targets, setTargets] = useState<Target[]>([]);
  const [filteredTargets, setFilteredTargets] = useState<Target[]>([]);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadTargetsAndStatus = async () => {
      try {
        const targetsData = await fetchAllTargets();
        const containersData = await fetchAllContainers();

        const containerMap = containersData.reduce((acc: Record<number, any>, container: any) => {
          acc[container.target_id] = container;
          return acc;
        }, {});

        const targetsWithStatus = targetsData.map((target: any) => ({
          ...target,
          isRunning: !!containerMap[target.id]?.status && containerMap[target.id].status === 'running',
        }));

        setTargets(targetsWithStatus);
        setFilteredTargets(targetsWithStatus);
      } catch (error) {
        console.error('Failed to load target status:', error);
      }
    };

    loadTargetsAndStatus();
  }, [fetchAllTargets, fetchAllContainers]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTargets(targets);
      return;
    }
    const filtered = targets.filter(
      (target) =>
        target.name.toLowerCase().includes(query.toLowerCase()) ||
        target.category.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredTargets(filtered);
  };



  const handleStart = async (targetId: number) => {
    if (loadingIds.has(targetId)) return;

    setLoadingIds((prev) => new Set(prev).add(targetId));
    try {
      await start(targetId);
      setTargets((prev) => {
        const nextState = prev.map((t) => {
          if (t.id === targetId) {
            const updatedTarget = { ...t, isRunning: true };
            return updatedTarget;
          } else {
            return t;
          }
        });
        setFilteredTargets(nextState);
        return nextState;
      });

    } catch (e) {
      alert('启动失败' + e);
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
    }
  };

  const handleStop = async (targetId: number) => {
    if (loadingIds.has(targetId)) return;

    setLoadingIds((prev) => new Set(prev).add(targetId));
    try {
      await stop(targetId);
      setTargets((prev) => {
        const nextState = prev.map((t) =>
          t.id === targetId ? { ...t, isRunning: false } : t
        );
        setFilteredTargets(nextState);
        return nextState;
      });

    } catch (e) {
      alert('停止失败' + e);
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
    }
  };

  // 动态提取分类
  const categories = Array.from(new Set(targets.map((t) => t.category))).sort();

  return (

    <div className="w-[240px] border-r border-gray-700 flex flex-col transition-all duration-300" id="sidebar">
      <div className="bg-[#2D2D2D] p-3 flex justify-between items-center">
        {/* Header */}
        <div className="flex justify-center ">
          <text className="text-white text-2xl ">靶场列表</text>
         </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Content */}
        <div className="content p-2">
          {/* 分类展示 */}
          {categories.map((category) => (
            <div key={category}>
              {filteredTargets.some((t) => t.category === category) && (
                <>
                  <div className="category-header text-gray-400 text-sm mb-2">{category}</div>
                  <div className="space-y-1">
                    {filteredTargets
                      .filter((t) => t.category === category)
                      .map((target) => (
                        <div
                          key={target.id}
                          className="target-item w-full text-left p-2 text-terminal-text text-sm hover:bg-[#2D2D2D] rounded flex items-center justify-between transition-colors whitespace-nowrap !rounded-button"
                          onClick={() => onSelectTarget(target.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <DynamicIcon name="terminal" className="icon text-green-500" />
                            <span>{target.name}</span>
                          </div>
                          <div className="controls flex items-center space-x-2">
                            <button
                              className={`px-2 py-1 rounded text-xs  text-white transition-colors !rounded-button start ${target.isRunning ? 'stop' : ''}${loadingIds.has(target.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                target.isRunning ? handleStop(target.id) : handleStart(target.id);
                              }}
                              disabled={loadingIds.has(target.id)}
                            >
                              {loadingIds.has(target.id) ? (
                                <DynamicIcon name="spinner" />
                              ) : (
                                <DynamicIcon  key={target.id} name={target.isRunning ? 'stop' : 'play'} />
                              )}
                            </button>
                            {/* <div>状态: {target.isRunning ? '运行中' : '停止'}</div> */}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {/* 搜索框 */}
        <div className="p-3">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </div>


  );
};

export default Sidebar;