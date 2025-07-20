import { Request } from 'express';
import moderateText from './moderateText.service';
import moderateImage from './moderateImage.service';
import uploadToSupabase from './uploadToSupabase.service';
// import { insertPost } from '../repositories/post.repositories'; // opsional DB

export const handleUploadPost = async (req: Request) => {
  const { user_id, challenge_id, text } = req.body;
  const file = req.file;

  if (!text && !file) {
    throw { status: 400, message: 'Text or image required' };
  }

  if (text) {
    try {
      const isTextSafe = await moderateText(text);
      if (!isTextSafe) {
        throw { status: 400, message: 'Caption flagged as inappropriate' };
      }
    } catch (e: any) {
      console.error('MODERATE TEXT ERROR:', e);
      
      // Jika error dari moderation (specific message), pass through
      if (e.message?.includes('flagged as inappropriate')) {
        throw { status: 400, message: e.message };
      }
      
      // Jika error API/service lain
      throw { status: 503, message: 'Text moderation service unavailable' };
    }
  }

  let imageUrl: string | null = null;
  if (file) {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw { status: 400, message: 'Invalid image format' };
    }

    try {
      const safeBuffer = await moderateImage(file.buffer);
      if (!safeBuffer) {
        throw { status: 400, message: 'Image flagged as inappropriate' };
      }

      const fileName = `posts/${user_id}_${challenge_id}_${Date.now()}.jpg`;
      imageUrl = await uploadToSupabase(safeBuffer, fileName);
    } catch (e: any) {
      console.error('IMAGE PROCESSING ERROR:', e);
      
      // Jika error moderation image
      if (e.message?.includes('flagged as inappropriate')) {
        throw { status: 400, message: e.message };
      }
      
      // Jika error upload
      if (e.message?.includes('Supabase upload failed')) {
        throw { status: 500, message: 'Image upload failed. Please try again.' };
      }
      
      // Error lain
      throw { status: 503, message: 'Image processing service unavailable' };
    }
  }

  // opsional: simpan ke DB
  // await insertPost({ user_id, challenge_id, text: text || null, image_url: imageUrl });

  return {
    message: 'Post uploaded successfully',
    image_url: imageUrl,
    text,
  };
};