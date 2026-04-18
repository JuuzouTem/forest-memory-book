import React from 'react';
import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemoryCard({ memory, index }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Şimdi';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('tr-TR', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }} // Her kart sırayla biraz gecikmeli gelir
      className="break-inside-avoid mb-4 bg-white rounded-2xl shadow-sm border border-sage/20 overflow-hidden relative"
    >
      
      {/* Resim */}
      <div className="relative">
        <img 
          src={memory.imageUrl} 
          alt="Orman Anısı" 
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        {/* Ruh Hali Emojisi */}
        {memory.mood && (
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-lg shadow-sm">
            {memory.mood}
          </div>
        )}
      </div>
      
      {/* Detaylar */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-olive/60 flex items-center gap-1">
            {memory.uploaderName}
          </span>
          <span className="text-[10px] text-olive/40">
            {formatDate(memory.createdAt)}
          </span>
        </div>

        {/* Sesli Not Varsa Göster */}
        {memory.audioUrl && (
          <div className="mt-2 mb-2 bg-cream/50 rounded-xl p-2 border border-sage/20 flex items-center gap-2">
            <Mic size={14} className="text-sage flex-shrink-0" />
            <audio src={memory.audioUrl} controls className="h-6 w-full max-w-[200px]" />
          </div>
        )}

        {/* Etiketler */}
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex overflow-x-auto snap-x no-scrollbar gap-1.5 mt-2">
            {memory.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="snap-start flex-shrink-0 bg-sage/10 text-sage px-2 py-1 rounded-md text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}