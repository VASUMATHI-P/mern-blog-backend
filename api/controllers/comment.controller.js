import { errorHandler } from "../utils/error.js";

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