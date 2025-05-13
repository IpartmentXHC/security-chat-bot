// components/TargetList/TargetCard.tsx
import React, { useEffect, useState } from 'react';
import { useContainer } from '../../hooks/useContainer';


interface TargetCardProps {
  target: {
    id: number;
    name: string;
    description: string;
    category: string;
  };
}

const TargetCard: React.FC<TargetCardProps> = ({ target }) => {
  const { start, stop, fetchAllContainers } = useContainer();
  const [status, setStatus] = useState<'running' | 'exited'>('exited'); // 默认为已退出

  useEffect(() => {
    const checkStatus = async () => {
      const containers = await fetchAllContainers();
      const container = containers.data.find((c:any) => c.target_id === target.id);
      if (container) {
        setStatus(container.status);
      }
    };
    checkStatus();
  }, [fetchAllContainers, target.id]);

  const handleStart = async () => {
    console.log('Starting container for target:', target.id);
    await start(target.id);
    setStatus('running');
  };

  const handleStop = async () => {
    console.log('Stopping container for target:', target.id);
    await stop(target.id);
    setStatus('exited');
  };

  return (
    <div className="bg-gray-800 p-4 rounded mb-2">
      <h3>{target.name}</h3>
      <p>{target.description}</p>
      <p>Category: {target.category}</p>
      <div className='bg-green-500 hover:bg-green-600'>
        {status === 'running' ? (
          <button onClick={handleStop}>停止</button>
        ) : (
          <button onClick={handleStart}>启动</button>
        )}
      </div>
    </div>
  );
};

export default TargetCard;