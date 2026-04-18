import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Trees, Map as MapIcon, ShieldCheck } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import Uploader from '../components/camera/Uploader';
import MasonryGrid from '../components/gallery/MasonryGrid';

export default function Home() {
  const { logout, userProfile, saveCoupleId } = useAuth();
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const[loadingMemories, setLoadingMemories] = useState(true);
  const [bubbleInput, setBubbleInput] = useState('');

  // SADECE GİZLİ BALONCUK KODUNA SAHİP ANILARI ÇEK
  useEffect(() => {
    if (!userProfile || !userProfile.coupleId) return;

    const q = query(
      collection(db, 'memories'),
      where('coupleId', '==', userProfile.coupleId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let memoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      memoriesData.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });

      setMemories(memoriesData);
      setLoadingMemories(false);
    });

    return () => unsubscribe();
  }, [userProfile?.coupleId]);

  // EĞER KULLANICININ BALONCUK KODU YOKSA KESİNLİKLE BU EKRANI GÖSTER
  if (!userProfile || !userProfile.coupleId) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-sage/20 max-w-sm w-full text-center">
          <div className="flex justify-center mb-4 text-sage">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-xl font-bold text-olive mb-2">Özel Baloncuk Kodu</h2>
          <p className="text-sm text-olive/70 mb-6">
            Anılarınızın başkaları tarafından görülmemesi için partnerinizle ortak ve gizli bir şifre belirleyin. İkiniz de aynı şifreyi girmelisiniz.
          </p>
          <input
            type="text"
            placeholder="Gizli kod (Örn: orman-123)"
            className="w-full px-4 py-3 border border-sage/30 rounded-xl mb-4 bg-cream/30 text-olive focus:outline-none focus:ring-2 focus:ring-sage/50 text-center"
            value={bubbleInput}
            onChange={(e) => setBubbleInput(e.target.value)}
          />
          <button
            onClick={() => bubbleInput.trim() && saveCoupleId(bubbleInput.trim())}
            className="w-full bg-sage text-white py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors"
          >
            Bağlan
          </button>
          <button onClick={logout} className="mt-4 text-sm text-dustyRose">Çıkış Yap</button>
        </div>
      </div>
    );
  }

  // NORMAL ANASAYFA
  return (
    <div className="p-4 flex flex-col items-center min-h-screen pb-20">
      <div className="w-full max-w-lg flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-sage/20 mb-4 sticky top-4 z-10">
        <div className="flex items-center gap-2 text-sage">
          <Trees size={24} />
          <h1 className="text-xl font-bold text-olive hidden sm:block">Orman Anıları</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/map')}
            className="text-dustyRose bg-dustyRose/10 hover:bg-dustyRose/20 px-3 py-2 rounded-xl transition-colors flex items-center gap-2 font-medium text-sm"
          >
            <MapIcon size={18} />
            Harita
          </button>
          <button 
            onClick={logout}
            className="text-olive hover:bg-olive/10 p-2 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-lg">
        <Uploader />
        {loadingMemories ? (
          <div className="mt-8 text-center text-sage">
            <div className="animate-pulse flex flex-col items-center gap-2">
              <Trees className="animate-bounce" size={32} />
              <p className="text-sm">Gizli anılarınız toplanıyor...</p>
            </div>
          </div>
        ) : (
          <MasonryGrid memories={memories} />
        )}
      </div>
    </div>
  );
}