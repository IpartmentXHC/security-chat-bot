// pages/dashboard/target-list.tsx
import React from 'react';
import Sidebar from '@/components/TargetList/Sidebar';

const TargetListPage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'monospace', backgroundColor: '#1e1e1e', color: '#ffffff' }}>
      <Sidebar />
    </div>
  );
};

export default TargetListPage;