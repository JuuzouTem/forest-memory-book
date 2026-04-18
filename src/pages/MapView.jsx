import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map as MapIcon } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore'; // where eklendi
import { db } from '../services/firebaseConfig';
import { useAuth } from '../context/AuthContext'; // useAuth eklendi
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const leafIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/6045/6045136.png',
  iconSize: [32, 32],
  iconAnchor:[16, 32],
  popupAnchor: [0, -32],
});

export default function MapView() {
  const navigate = useNavigate();
  const { userProfile } = useAuth(); // userProfile çekildi
  const[memories, setMemories] = useState([]);
  const defaultCenter =[39.0, 35.0];

  useEffect(() => {
    if (!userProfile?.coupleId) return;

    // SADECE GİZLİ KODLU HARİTA İĞNELERİ ÇEKİLİYOR
    const q = query(
      collection(db, 'memories'),
      where('coupleId', '==', userProfile.coupleId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(memory => memory.location && memory.location.lat && memory.location.lng);
      setMemories(data);
    });

    return () => unsubscribe();
  },[userProfile?.coupleId]);

  return (
    <div className="relative h-screen w-full bg-cream flex flex-col">
      <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between items-center bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-sage/20">
        <button onClick={() => navigate('/')} className="text-sage hover:bg-sage/10 p-2 rounded-full transition-colors flex items-center gap-2">
          <ArrowLeft size={20} />
          <span className="font-medium text-sm">Galeriye Dön</span>
        </button>
        <div className="flex items-center gap-2 text-olive font-bold">
          <MapIcon size={20} className="text-dustyRose" />
          Anı Haritası
        </div>
      </div>

      <div className="flex-1 z-0">
        <MapContainer center={defaultCenter} zoom={6} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer attribution='&copy; OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {memories.map((memory) => (
            <Marker key={memory.id} position={[memory.location.lat, memory.location.lng]} icon={leafIcon}>
              <Popup className="rounded-xl">
                <div className="w-32 flex flex-col items-center">
                  <img src={memory.imageUrl} alt="Anı" className="w-full h-24 object-cover rounded-lg mb-2" />
                  <span className="text-xs text-olive font-medium">{memory.mood && `${memory.mood} `}{memory.uploaderName}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}