import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  data: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchAutocomplete({
  value,
  onChange,
  data,
  placeholder,
  disabled = false,
  className
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 2) {
      const filtered = data
        .filter(item => 
          item.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 suggestions
      setFilteredData(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredData([]);
      setIsOpen(false);
    }
  }, [value, data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSelectItem = (item: string) => {
    onChange(item);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        />
      </div>
      
      {isOpen && filteredData.length > 0 && (
        <div 
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredData.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectItem(item)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none first:rounded-t-md last:rounded-b-md"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}