import React, { useState, useRef } from 'react';
import { Camera, ImagePlus, Loader2, X, MapPin } from 'lucide-react';
import { uploadFileToCloudinary } from '../../services/uploadService';
import { db } from '../../services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import TagInput from '../tags/TagInput';
import VoiceRecorder from '../audio/VoiceRecorder';

const MOODS =[
  { emoji: '🌿', label: 'Huzurlu' },
  { emoji: '🌧️', label: 'Yağmurlu' },
  { emoji: '☕', label: 'Sıcak' },
  { emoji: '✨', label: 'Büyülü' },
  { emoji: '😴', label: 'Yorgun' }
];

export default function Uploader() {
  const { currentUser } = useAuth();
  const[isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const[audioFile, setAudioFile] = useState(null);
  
  // Yeni: Konum State'i
  const[locationEnabled, setLocationEnabled] = useState(true);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTags([]);
    setSelectedMood(null);
    setAudioFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // GPS Konumunu Al
  const getLocation = () => {
    return new Promise((resolve) => {
      if (!locationEnabled || !navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => {
          console.warn("Konum alınamadı:", error);
          resolve(null); // İzin verilmezse konumsaz devam et
        },
        { enableHighAccuracy: true }
      );
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentUser) return;

    try {
      setIsUploading(true);
      
      const imageUrl = await uploadFileToCloudinary(selectedFile, 'image');
      
      let audioUrl = null;
      if (audioFile) {
        audioUrl = await uploadFileToCloudinary(audioFile, 'video');
      }

      // Konumu al
      const location = await getLocation();

      await addDoc(collection(db, 'memories'), {
        imageUrl,
        audioUrl,
        mood: selectedMood,
        location, // Yeni: Konum verisi (lat, lng) kaydediliyor
        uploadedBy: currentUser.uid,
        uploaderName: currentUser.displayName || currentUser.email.split('@')[0],
        createdAt: serverTimestamp(),
        tags,
      });

      handleCancel();
    } catch (error) {
      console.error("Yükleme hatası:", error);
      alert("Anı yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-sage/20 p-4 mt-4">
      {previewUrl ? (
        <div className="flex flex-col gap-3">
          <div className="relative w-full rounded-xl overflow-hidden bg-cream flex justify-center">
            <img src={previewUrl} alt="Önizleme" className="max-h-64 object-contain" />
            <button 
              onClick={handleCancel}
              disabled={isUploading}
              className="absolute top-2 right-2 bg-olive/50 text-white p-1.5 rounded-full backdrop-blur-sm hover:bg-dustyRose transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex justify-between items-center bg-cream/50 p-2 rounded-xl border border-sage/30">
            {MOODS.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(selectedMood === mood.emoji ? null : mood.emoji)}
                className={`text-2xl p-2 rounded-lg transition-transform ${
                  selectedMood === mood.emoji ? 'bg-sage/30 scale-110' : 'hover:bg-sage/10 grayscale hover:grayscale-0'
                }`}
                title={mood.label}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
          
          <TagInput selectedTags={tags} setSelectedTags={setTags} />
          
          <VoiceRecorder 
            onAudioReady={(file) => setAudioFile(file)} 
            onClear={() => setAudioFile(null)} 
          />

          {/* Konum Seçeneği */}
          <button 
            onClick={() => setLocationEnabled(!locationEnabled)}
            className={`flex items-center gap-2 text-sm p-2 rounded-xl border transition-colors ${
              locationEnabled ? 'bg-sage/20 border-sage/40 text-sage' : 'bg-gray-100 border-gray-200 text-gray-400'
            }`}
          >
            <MapPin size={16} />
            {locationEnabled ? 'Konum Eklenecek' : 'Konum Kapalı'}
          </button>

          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-3 mt-2 bg-sage hover:bg-sage/90 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Yükleniyor...
              </>
            ) : (
              'Anıyı Paylaş'
            )}
          </button>
        </div>
      ) : (
        <div className="flex gap-3 mb-2">
          <button 
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-2 py-6 bg-sage/10 text-sage hover:bg-sage/20 rounded-xl border border-sage/30 transition-colors"
          >
            <Camera size={28} />
            <span className="text-sm font-medium">Kamera</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileSelect} />
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-2 py-6 bg-dustyRose/10 text-dustyRose hover:bg-dustyRose/20 rounded-xl border border-dustyRose/30 transition-colors"
          >
            <ImagePlus size={28} />
            <span className="text-sm font-medium">Galeri</span>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
          </button>
        </div>
      )}
    </div>
  );
}