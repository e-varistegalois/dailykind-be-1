import { Request, Response } from 'express';
import { updateDraftService } from '../../services/post/updateDraft.service';

export const updateDraftController = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const file = req.file;
    
    if (!postId) {
      return res.status(400).json({
        message: 'Post ID is required'
      });
    }

    const result = await updateDraftService(postId, {
      content 
    }, file);
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in updateDraftController:', error);
    
    if (error.status) {
      return res.status(error.status).json({
        message: error.message
      });
    }
    
    res.status(500).json({
      message: 'Failed to publish draft',
      error: error.message
    });
  }
};