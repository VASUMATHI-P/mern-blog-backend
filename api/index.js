import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/user.routes.js'
import authRoute from './routes/auth.route.js'
import postRoute from './routes/post.route.js'
import commentRoute from './routes/comment.route.js'
import cookieParser from 'cookie-parser';
const app = express();
import dotenv from 'dotenv';
dotenv.config();

app.use(express.json())
mongoose.connect(process.env.MONGODB_CONNECT_URL)
        .then(() => {
          console.log('Connected to MongoDB');
        })
        .catch((err) => {
          console.log('Error connecting to MongoDB');
        });


app.use(cookieParser());
app.get('/', () => {
  console.log('Hello World!');
})

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)
app.use('/api/comment', commentRoute)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({success: false, message})
})

app.listen(3000, () => {
  console.log('app listening on port 3000!')
})
