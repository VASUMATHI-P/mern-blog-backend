import Post from "../model/post.model.js";

export const create = async (req, res, next) => {
  if(!req.user.isAdmin){
    return res.status(401).json({message: "You are not authorized to perform this action"});
  }

  if(!req.body.title || !req.body.content){
    return res.status(400).json({message: "Title and content are required"});
  }

  const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

  const newPost = new Post({
    ...req.body,
    slug: slug,
    userId: req.user.id
  })

  try{
    await newPost.save();
    res.status(201).json(newPost);
  } catch(err){
    next(err);
  }
}