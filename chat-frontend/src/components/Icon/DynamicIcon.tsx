// components/Icon/DynamicIcon.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// 导入常用图标
import {
  faPlay,
  faStop,
  faTerminal,
  faNetworkWired,
  faSearch,
  faChevronLeft,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { faAndroid, faApple ,} from '@fortawesome/free-brands-svg-icons';
// 可用图标集合
const iconMap: Record<string, any> = {
  play: faPlay,
  stop: faStop,
  terminal: faTerminal,
  networkWired: faNetworkWired,
  android: faAndroid,
  apple: faApple,
  search: faSearch,
  chevronLeft: faChevronLeft,
  spinner : faSpinner
};

interface DynamicIconProps {
  name: keyof typeof iconMap;
  className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className }) => {
  const icon = iconMap[name];

  if (!icon) {
    console.warn(`Icon "${name}" not found in iconMap.`);
    return null;
  }

  return <FontAwesomeIcon icon={icon} className={className} />;
};

export default DynamicIcon;