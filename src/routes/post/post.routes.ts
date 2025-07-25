import express from 'express';
import multer from 'multer';
import { uploadPostController } from '../../controller/post/uploadPost.controller';
import { toggleLikeController } from '../../controller/post/like.controller';
import { getPostsByChallengeIdController } from '../../controller/post/getPostsByChallengeId.controller';
import { getPostsByUserIdController } from '../../controller/post/getPostsByUserId.controller';
import { getUserDraftsController } from '../../controller/post/getUserDrafts.controller';
import { updateDraftController } from '../../controller/post/updateDraft.controller';


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/upload-post', upload.single('image'), uploadPostController);
router.get('/:challengeId/', getPostsByChallengeIdController);

router.post('/likes/:postId', toggleLikeController);
router.get('/user/:userId', getPostsByUserIdController);
router.get('/user/:userId/drafts', getUserDraftsController); 

router.put('/:postId', upload.single('image'), updateDraftController);


export default router;
