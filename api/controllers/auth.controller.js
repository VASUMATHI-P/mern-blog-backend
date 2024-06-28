import User from '../model/user.model.js'
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv'
import { errorHandler } from '../utils/error.js';

dotenv.config();

export const signup = async (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    next(errorHandler(400, 'All fields are required'))
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    password: hashedPassword,
    email
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err){
    next(err);
  }

}

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(errorHandler(400, 'All fields are required'))
  }
  const validUser = await User.findOne({email});
  if(!validUser){
    return next(errorHandler(404, 'User not found'))
  }
  const validPassword = bcryptjs.compareSync(
    password,
    validUser.password
  )
  if(!validPassword){
    return next(errorHandler(401, 'Invalid password'))
  }
  const {password:pass , ...rest} = validUser._doc;
  const token = jwt.sign(
    {id : validUser._id},
    process.env.JWT_SECRET,
    {expiresIn: '1m'}
  )
  res.status(200).cookie('access_token', token, {httpOnly: true}).json({rest});
}

export const google = async (req, res, next) => {
  const { email, name, profilePicture } = req.body;
  try {
    const user = await User.findOne({email});
    if(user){
      const {password:pass , ...rest} = user._doc;
      const token = jwt.sign(
        {id : user._id},
        process.env.JWT_SECRET
      )
      res.status(200).cookie('access_token', token, {httpOnly: true}).json({rest});
    } else {
      const generatedPassword = Math.random().toString(32).slice(-8) + Math.random().toString(32).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        email,
        username : name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        profilePicture,
        password: hashedPassword
      });

      await newUser.save();
      const {password:pass , ...rest} = newUser._doc;
      const token = jwt.sign(
        {id : newUser._id},
        process.env.JWT_SECRET
      )
      res.status(200).cookie('access_token', token, {httpOnly: true}).json({rest});
    }
  } catch (err) {
      next(err);
  }
}