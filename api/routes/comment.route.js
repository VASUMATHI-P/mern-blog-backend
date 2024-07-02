import { verifyUser } from "../utils/verifyUser.js";
import express from 'express';
import { createComment, getPostComments } from "../controllers/comment.controller.js";

const router = express.Router();

router.post('/create', verifyUser, createComment);
router.get('/getpostcomments/:postId', getPostComments);

export default router;