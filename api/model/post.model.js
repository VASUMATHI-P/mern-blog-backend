import mongoose, { mongo } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true,
      unique : true
    },
    
    content: {
        type: String,
        required: true,
    },

    image: {
      type: String,
      default: "https://tse4.mm.bing.net/th?id=OIP.ZhwXnqR2QeDUoMdVKm2fpgHaDt&pid=Api&P=0&h=180"
    },

    category: {
      type: String,
      default: 'uncategorized'
    },

    slug: {
      type: String,
      required: true,
      unique : true
    }
  }, {timestamps: true}
)

const Post = mongoose.model('Post', postSchema);
export default Post;