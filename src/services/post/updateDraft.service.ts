import { prisma } from '../../db/index';
import moderateText  from './moderateText.service';
import uploadToSupabase from './uploadToSupabase.service';
import moderateImage from './moderateImage.service';

export const updateDraftService = async (postId: string, data: {
  content?: string;
}, file?: Express.Multer.File) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        challenge: true
      }
    });

    if (!post) {
      throw { status: 404, message: 'Post not found' };
    }

    if (post.status === 'PUBLISHED') {
      throw { status: 400, message: 'Cannot update published post' };
    }

    if (!post.challenge.isActive) {
      throw { status: 400, message: 'Cannot update post for inactive challenge' };
    }

    let newImageUrl = post.imageUrl;

    // Handle image upload if provided
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        throw { status: 400, message: 'Invalid image format' };
      }

      // Always moderate image since we're publishing
      const safeBuffer = await moderateImage(file.buffer);
      if (!safeBuffer) {
        throw { status: 400, message: 'Image flagged as inappropriate' };
      }
      const fileName = `posts/${post.userId}_${post.challengeId}_${Date.now()}.jpg`;
      newImageUrl = await uploadToSupabase(safeBuffer, fileName);
    }

    // Determine final content
    const finalContent = data.content !== undefined ? data.content : post.content;
    
    // Must have content for published posts
    if (!finalContent && !newImageUrl) {
      throw { status: 400, message: 'Published post must have content or image' };
    }

    // Moderate text if provided
    if (finalContent) {
      const isTextSafe = await moderateText(finalContent);
      if (!isTextSafe) {
        throw { status: 400, message: 'Content flagged as inappropriate' };
      }
    }

    // Update post and set status to PUBLISHED
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(data.content !== undefined && { content: data.content }),
        ...(newImageUrl && { imageUrl: newImageUrl }),
        status: 'PUBLISHED' 
      }
    });

    return {
      message: 'Draft published successfully',
      post: updatedPost
    };

  } catch (error) {
    throw error;
  }
};