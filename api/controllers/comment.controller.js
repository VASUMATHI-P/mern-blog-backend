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

export const likeComment = async (req, res, next) => {
  try{
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
      return next(errorHandler(404, 'Comment not found'))
    }

    const userIndex = comment.likes.indexOf(req.user.id);
    if(userIndex === -1){
      comment.likes.push(req.user.id)
      comment.numberOfLikes += 1
    } else {
      comment.numberOfLikes -= 1
      comment.likes.splice(userIndex, 1)
    }
    await comment.save();
    res.status(200).json({comment});
  } catch(err){
    next(err);
  }
}

export const editComment = async(req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if(!comment){
    return next(errorHandler(404, 'Comment not found'))
  }

  if(comment.userId !== req.user.id && !req.user.isAdmin){
    return next(errorHandler(403, 'You are not allowed to edit this comment'))
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId,
      {
        $set: {
          content: req.body.content
        }
      } , {new : true}
    )
    res.status(200).json({updatedComment});
  } catch(err) {
    next(err);
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
      return next(errorHandler(404, 'Comment not found'))
    }
    if(comment.userId !== req.user.id && !req.user.isAdmin){
      return next(errorHandler(403, 'You are not allowed to delete this comment'))
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({message: 'Comment deleted successfully'});
  } catch(err){
    next(err);
  }
}

export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, 'You are not allowed to get all comments'));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};