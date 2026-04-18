import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function TagInput({ selectedTags, setSelectedTags }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmedTag = inputValue.trim().toLowerCase();
    
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="w-full mt-3">
      <form onSubmit={handleAddTag} className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Etiket ekle (örn: yağmur, kahve)..."
          className="flex-1 bg-cream/50 border border-sage/30 rounded-xl px-4 py-2 text-sm text-olive focus:outline-none focus:ring-2 focus:ring-sage/50"
        />
        <button 
          type="submit"
          disabled={!inputValue.trim()}
          className="bg-sage/20 text-sage p-2 rounded-xl hover:bg-sage/30 disabled:opacity-50 transition-colors"
        >
          <Plus size={20} />
        </button>
      </form>

      {/* Yatay Kaydırılabilir Etiket Listesi */}
      {selectedTags.length > 0 && (
        <div className="flex overflow-x-auto snap-x no-scrollbar gap-2 pb-1">
          {selectedTags.map((tag) => (
            <span 
              key={tag}
              className="snap-start flex-shrink-0 flex items-center gap-1.5 bg-sage text-white px-3 py-1.5 rounded-full text-xs font-medium"
            >
              #{tag}
              <button 
                onClick={() => removeTag(tag)}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}