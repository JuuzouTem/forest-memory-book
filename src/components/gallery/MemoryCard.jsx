import React from 'react';
import { Mic, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { useAuth } from '../../context/AuthContext';

export default function MemoryCard({ memory, index }) {
  const { currentUser } = useAuth(); // Sadece yükleyen kişi silebilsin diye

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Şimdi';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  // YENİ: Silme İşlemi (Sadece Listeden/Veritabanından siler, Depolamadan silmez)
  const handleDelete = async () => {
    if (window.confirm("Bu anıyı kaldırmak istediğinize emin misiniz?")) {
      try {
        await deleteDoc(doc(db, 'memories', memory.id));
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Silinirken bir hata oluştu.");
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} 
      className="break-inside-avoid mb-4 bg-white rounded-2xl shadow-sm border border-sage/20 overflow-hidden relative"
    >
      <div className="relative">
        <img src={memory.imageUrl} alt="Orman Anısı" className="w-full h-auto object-cover" loading="lazy" />
        {memory.mood && <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-lg shadow-sm">{memory.mood}</div>}
        
        {/* YENİ: SİLME BUTONU (Sadece fotoğrafı yükleyen kişi görebilir) */}
        {currentUser?.uid === memory.uploadedBy && (
          <button onClick={handleDelete} className="absolute top-2 left-2 bg-red-500/80 backdrop-blur-sm text-white p-1.5 rounded-full shadow-sm hover:bg-red-600 transition-colors" title="Anıyı Kaldır">
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-olive/60 flex items-center gap-1">{memory.uploaderName}</span>
          <span className="text-[10px] text-olive/40">{formatDate(memory.createdAt)}</span>
        </div>
        {memory.audioUrl && (
          <div className="mt-2 mb-2 bg-cream/50 rounded-xl p-2 border border-sage/20 flex items-center gap-2">
            <Mic size={14} className="text-sage flex-shrink-0" />
            <audio src={memory.audioUrl} controls className="h-6 w-full max-w-[200px]" />
          </div>
        )}
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex overflow-x-auto snap-x no-scrollbar gap-1.5 mt-2">
            {memory.tags.map((tag, idx) => (
              <span key={idx} className="snap-start flex-shrink-0 bg-sage/10 text-sage px-2 py-1 rounded-md text-[10px] font-medium">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}