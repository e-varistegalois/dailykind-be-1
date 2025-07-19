import express from 'express';
import multer from 'multer';
import { uploadPostController } from '../../controller/post/uploadPost.controller';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/upload-post', upload.single('image'), uploadPostController);

export default router;
