import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// İkonlar Güncellendi
import { LogOut, Trees, Map as MapIcon, ShieldCheck, DoorOpen, User } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import Uploader from '../components/camera/Uploader';
import MasonryGrid from '../components/gallery/MasonryGrid';

export default function Home() {
  const { logout, currentUser, userProfile, saveCoupleId, updateUsername } = useAuth();
  const navigate = useNavigate();
  const[memories, setMemories] = useState([]);
  const [loadingMemories, setLoadingMemories] = useState(true);
  const [bubbleInput, setBubbleInput] = useState('');

  useEffect(() => {
    if (!userProfile || !userProfile.coupleId) return;
    const q = query(collection(db, 'memories'), where('coupleId', '==', userProfile.coupleId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let memoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      memoriesData.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setMemories(memoriesData);
      setLoadingMemories(false);
    });
    return () => unsubscribe();
  }, [userProfile?.coupleId]);

  // YENİ: Veritabanındaki tüm etiketleri bir havuzda topla (Tekrarsız)
  const availableTags =[...new Set(memories.flatMap(m => m.tags || []))];

  // YENİ: Kullanıcı Adı Değiştirme Promptu
  const handleChangeName = async () => {
    const newName = window.prompt("Yeni kullanıcı adınızı girin:", currentUser?.displayName || "");
    if (newName && newName.trim() !== "") {
      await updateUsername(newName.trim());
    }
  };

  // YENİ: Baloncuktan Çıkma (Hesaptan çıkmaz, sadece odayı terk eder)
  const handleLeaveBubble = async () => {
    if (window.confirm("Bu baloncuktan çıkmak istediğinize emin misiniz? (Fotoğraflarınız silinmez, sadece bağınız kopar)")) {
      await saveCoupleId(null);
    }
  };

  if (!userProfile || !userProfile.coupleId) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-sage/20 max-w-sm w-full text-center">
          <div className="flex justify-center mb-4 text-sage"><ShieldCheck size={48} /></div>
          <h2 className="text-xl font-bold text-olive mb-2">Özel Baloncuk Kodu</h2>
          <p className="text-sm text-olive/70 mb-6">Anılarınızın başkaları tarafından görülmemesi için gizli bir şifre girin.</p>
          <input type="text" placeholder="Gizli kod (Örn: orman-123)" className="w-full px-4 py-3 border border-sage/30 rounded-xl mb-4 bg-cream/30 text-olive focus:outline-none focus:ring-2 focus:ring-sage/50 text-center" value={bubbleInput} onChange={(e) => setBubbleInput(e.target.value)} />
          <button onClick={() => bubbleInput.trim() && saveCoupleId(bubbleInput.trim())} className="w-full bg-sage text-white py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors mb-2">Bağlan</button>
          <button onClick={logout} className="w-full text-sm text-dustyRose py-2">Hesaptan Çık</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center min-h-screen pb-20">
      {/* Üst Bar Tasarımı Yenilendi */}
      <div className="w-full max-w-lg flex justify-between items-center bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-sage/20 mb-4 sticky top-4 z-10">
        <div className="flex items-center gap-2 text-sage">
          <Trees size={24} />
          <h1 className="text-lg sm:text-xl font-bold text-olive hidden sm:block">Orman Anıları</h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={handleChangeName} title="Kullanıcı Adı" className="text-olive hover:bg-olive/10 p-2 rounded-full transition-colors"><User size={18} /></button>
          <button onClick={handleLeaveBubble} title="Baloncuktan Çık" className="text-dustyRose hover:bg-dustyRose/10 p-2 rounded-full transition-colors"><DoorOpen size={18} /></button>
          <button onClick={() => navigate('/map')} title="Harita" className="text-sage bg-sage/10 hover:bg-sage/20 p-2 rounded-xl transition-colors"><MapIcon size={18} /></button>
          <button onClick={logout} title="Çıkış Yap" className="text-red-400 hover:bg-red-50 p-2 rounded-full transition-colors"><LogOut size={18} /></button>
        </div>
      </div>
      
      <div className="w-full max-w-lg">
        {/* Etiketleri Uploader'a gönderiyoruz */}
        <Uploader availableTags={availableTags} />
        {loadingMemories ? (
          <div classN