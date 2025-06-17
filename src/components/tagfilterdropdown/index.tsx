import React, { useState, useRef, useEffect } from 'react';

interface TagFilterDropdownProps {
  availableTags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const TagFilterDropdown: React.FC<TagFilterDropdownProps> = ({
  availableTags,
  selectedTags,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="bg-white dark:bg-gray-800 text-black dark:text-white border px-4 py-2 rounded shadow"
      >
        Tags {selectedTags.length > 0 ? `(${selectedTags.length})` : ''}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg">
          <div className="p-2 max-h-60 overflow-y-auto">
            <label className="block">
              <input
                type="checkbox"
                checked={selectedTags.length === 0}
                onChange={() => onChange([])}
              />
              <span className="ml-2">No Tag Filter</span>
            </label>
            {availableTags.map((tag) => (
              <label key={tag} className="flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                <span className="ml-2">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagFilterDropdown;
