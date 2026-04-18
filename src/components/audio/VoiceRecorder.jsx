import React, { useState, useRef } from 'react';
import { Mic, Square, Trash2, Play } from 'lucide-react';

export default function VoiceRecorder({ onAudioReady, onClear }) {
  const[isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // Mikrofon izni iste ve akışı başlat
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current =[];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        // Kayıt bitince dosyayı oluştur (webm formatında)
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Üst bileşene (Uploader'a) kaydı gönder (Cloudinary'e yüklemek için blob gerekir)
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
        onAudioReady(audioFile);
        
        // Mikrofonu kapat
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Mikrofon erişim hatası:", error);
      alert("Ses kaydetmek için mikrofon izni vermelisiniz.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearAudio = () => {
    setAudioUrl(null);
    onClear();
  };

  return (
    <div className="w-full bg-cream/50 rounded-xl p-3 border border-sage/30 mt-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-olive flex items-center gap-2">
          <Mic size={16} /> 
          {isRecording ? "Orman Dinleniyor..." : "Sesli Not Ekle"}
        </span>

        {/* Kayıt bitmiş ve dinlenebilir durumda */}
        {audioUrl ? (
          <div className="flex items-center gap-2">
            <audio src={audioUrl} controls className="h-8 w-40" />
            <button 
              onClick={clearAudio}
              className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          /* Kayıt başlat / durdur butonu */
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-full transition-colors ${
              isRecording 
                ? 'bg-red-100 text-red-500 animate-pulse' 
                : 'bg-sage/20 text-sage hover:bg-sage/30'
            }`}
          >
            {isRecording ? <Square size={16} /> : <Mic size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}