// components/TargetList/SearchBar.tsx
import React from 'react';
import DynamicIcon from '@/components/Icon/DynamicIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearch(query);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="搜索靶场..."
        onChange={handleInputChange}
        className="w-full bg-transparent text-white p-2 pl-8 !rounded-button border-none text-sm focus:outline-none"
      />
      <DynamicIcon
        name="search"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
    </div>
  );
};

export default SearchBar;