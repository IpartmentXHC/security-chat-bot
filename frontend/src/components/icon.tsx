// components/Icon.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBug,
    faShieldAlt,
    faTerminal,
    faNetworkWired,
    faPlay,
    faPlus,
    faClock,
    faTasks,
    faPaperPlane,
    faExpandAlt,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
// Import faAndroid from the correct package
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';

interface IconProps {
    name: string;
    className?: string;
}

const iconMap = {
    'faBug': faBug,
    'faShieldAlt': faShieldAlt,
    'faTerminal': faTerminal,
    'faNetworkWired': faNetworkWired,
    'faAndroid': faAndroid,
    'faApple': faApple,
    'faPlay': faPlay,
    'faPlus': faPlus,
    'faClock': faClock,
    'faTasks': faTasks,
    'faPaperPlane': faPaperPlane,
    'faExpandAlt': faExpandAlt,
    'faSearch': faSearch,
};

export default function Icon({ name, className }: IconProps) {
    return (
        <FontAwesomeIcon
            icon={iconMap[name as keyof typeof iconMap]}
            className={className}
        />
    );
}