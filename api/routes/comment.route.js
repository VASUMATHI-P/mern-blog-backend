import { verifyUser } from "../utils/verifyUser.js";
import express from 'express';
import { createComment, getPostComments, likeComment, editComment, deleteComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post('/create', verifyUser, createComment);
router.get('/getpostcomments/:postId', getPostComments);
router.put('/likecomment/:commentId', verifyUser, likeComment);
router.put('/editcomment/:commentId', verifyUser, editComment)
router.delete('/deletecomment/:commentId', verifyUser, deleteComment)

export default router;