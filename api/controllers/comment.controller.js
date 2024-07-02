import { errorHandler } from "../utils/error.js";
import Comment from "../model/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const {content, postId, userId} = req.body;
    if(req.user.id !== userId){
      return next(errorHandler(404, 'Unauthorized'))
    }
    const newComment = await Comment.create({content, postId, userId})
    res.status(201).json({newComment})
  } catch(err){
    next(err);
  }
}

export const getPostComments = async(req, res, next) => {
  try{
    const {postId} = req.params;
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1
    })
    res.status(200).json({comments})
  } catch(err){
    next(err);
  }
}