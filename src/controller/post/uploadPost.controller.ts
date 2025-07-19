import { Request, Response } from 'express';
import { handleUploadPost } from '../../services/post/uploadPost.service';

export const uploadPostController = async (req: Request, res: Response) => {
  console.log('MASUK CONTROLLER', req.body, req.file);
  try {
    const result = await handleUploadPost(req);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
  }
};
