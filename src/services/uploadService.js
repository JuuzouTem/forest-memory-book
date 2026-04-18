import { compressImage } from '../utils/imageCompressor';

// Ekran görüntülerinden aldığım senin bilgilerin:
const CLOUD_NAME = "dvezpr7je"; 
const UPLOAD_PRESET = "Forest Memory Book"; 

export const uploadFileToCloudinary = async (file, type = 'image') => {
  try {
    let fileToUpload = file;

    if (type === 'image') {
      fileToUpload = await compressImage(file);
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', UPLOAD_PRESET);

    const resourceType = type === 'image' ? 'image' : 'video';

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Dosya yükleme başarısız oldu.');
    }

    return data.secure_url;

  } catch (error) {
    console.error('Cloudinary yükleme hatası:', error);
    throw error;
  }
};