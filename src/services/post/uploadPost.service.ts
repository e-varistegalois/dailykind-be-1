import { Request } from 'express';
import moderateText from './moderateText.service';
import moderateImage from './moderateImage.service';
import uploadToSupabase from './uploadToSupabase.service';
import { getChallengeByIdService } from '../challenge/getChallengeById.service';
import { createPost } from '../../repositories/post/post.repositories';

export const handleUploadPost = async (req: Request) => {
  const { user_id, challenge_id, text, status = 'PUBLISHED' } = req.body;
  const file = req.file;

  // validate challenge_id
  if (!challenge_id) {
    throw { status: 400, message: 'challenge_id is required' };
  }
  const challenge = (await getChallengeByIdService(challenge_id)).challenge;
  console.log("challenge wakakak: ", challenge);
  if (!challenge) {
    throw { status: 404, message: 'Invalid challenge_id' };
  }
  
  if (!['DRAFT', 'PUBLISHED'].includes(status)) {
    throw { status: 400, message: 'Invalid status. Must be DRAFT or PUBLISHED' };
  }

  if (status === 'PUBLISHED') {
    // Published posts MUST have content
    if (!text && !file) {
      throw { status: 400, message: 'Text or image required for published posts' };
    }
  }
  
  let imageUrl: string | null = null;

  if (status === 'PUBLISHED') {
    // check text
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
  } else {
    // DRAFT: Skip moderation, just upload image if exists
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        throw { status: 400, message: 'Invalid image format' };
      }

      try {
        const fileName = `drafts/${user_id}_${challenge_id}_${Date.now()}.jpg`;
        imageUrl = await uploadToSupabase(file.buffer, fileName); // Upload without moderation
      } catch (e: any) {
        console.error('DRAFT IMAGE UPLOAD ERROR:', e);
        throw { status: 500, message: 'Image upload failed. Please try again.' };
      }
    }
  }

  // simpan ke DB
  const createdPost = await createPost({ user_id, challenge_id, text: text || undefined, image_url: imageUrl || undefined, status });

  return {
    message: status === 'DRAFT' ? 'Draft saved successfully' : 'Post uploaded successfully',
    post: {
      id: createdPost.id,
      imageUrl: createdPost.imageUrl,
      content: createdPost.content,
      status: createdPost.status
    }
  };
};