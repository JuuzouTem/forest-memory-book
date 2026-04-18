import React from 'react';
import MemoryCard from './MemoryCard';
import { motion } from 'framer-motion';

export default function MasonryGrid({ memories }) {
  if (!memories || memories.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="mt-8 text-center p-8 bg-white/50 rounded-2xl border border-sage/20 border-dashed"
      >
        <p className="text-olive/60 text-sm">
          Henüz hiç anı yok. İlk fotoğrafı yükleyerek anı defterini başlatın! 🍃
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mt-6 columns-2 gap-4 w-full">
      {memories.map((memory, index) => (
        <MemoryCard key={memory.id} memory={memory} index={index} />
      ))}
    </div>
  );
}