// components/DynamicIcon.tsx
import dynamic from 'next/dynamic';

export default dynamic(() => import('./icon'), { ssr: false });