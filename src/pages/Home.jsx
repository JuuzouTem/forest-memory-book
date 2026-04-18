import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Trees, Map as MapIcon } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import Uploader from '../components/camera/Uploader';
import MasonryGrid from '../components/gallery/MasonryGrid';

export default function Home() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const[memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'memories'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMemories(memoriesData);
      setLoading(false);
    });

    return () => unsubscribe();
  },[]);

  return (
    <div className="p-4 flex flex-col items-center min-h-screen pb-20">
      <div className="w-full max-w-lg flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-sage/20 mb-4 sticky top-4 z-10">
        <div className="flex items-center gap-2 text-sage">
          <Trees size={24} />
          <h1 className="text-xl font-bold text-olive hidden sm:block">Orman Anıları</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Yeni Harita Butonu */}
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
        {loading ? (
          <div className="mt-8 text-center text-sage">
            <div className="animate-pulse flex flex-col items-center gap-2">
              <Trees className="animate-bounce" size={32} />
              <p className="text-sm">Anılar ormandan toplanıyor...</p>
            </div>
          </div>
        ) : (
          <MasonryGrid memories={memories} />
        )}
      </div>
    </div>
  );
}