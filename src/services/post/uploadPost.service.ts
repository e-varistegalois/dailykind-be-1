import { Request } from 'express';
import moderateText from './moderateText.service';
import moderateImage from './moderateImage.service';
import uploadToSupabase from './uploadToSupabase.service';
// import { insertPost } from '../repository/post.repository'; // opsional DB

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
    } catch (e) {
      console.error('MODERATE TEXT ERROR:', e);
      throw { status: 400, message: 'Moderation service error' };
    }
  }

  let imageUrl: string | null = null;
  if (file) {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw { status: 400, message: 'Invalid image format' };
    }

    const safeBuffer = await moderateImage(file.buffer);
    if (!safeBuffer) {
      throw { status: 400, message: 'Image flagged as inappropriate' };
    }

    const fileName = `posts/${user_id}_${challenge_id}_${Date.now()}.jpg`;
    imageUrl = await uploadToSupabase(safeBuffer, fileName);
  }

  // opsional: simpan ke DB
  // await insertPost({ user_id, challenge_id, text: text || null, image_url: imageUrl });

  return {
    message: 'Post uploaded successfully',
    image_url: imageUrl,
    text,
  };
};
