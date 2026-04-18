import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  // Sıkıştırma ayarları (Maksimum 500kb ve 1920px çözünürlük)
  const options = {
    maxSizeMB: 0.5, 
    maxWidthOrHeight: 1920,
    useWebWorker: true, // Tarayıcıyı dondurmamak için arka planda çalışır
  };
  
  try {
    console.log(`Orijinal boyut: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    const compressedFile = await imageCompression(file, options);
    console.log(`Sıkıştırılmış boyut: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    return compressedFile;
  } catch (error) {
    console.error("Görsel sıkıştırma hatası:", error);
    throw error;
  }
};