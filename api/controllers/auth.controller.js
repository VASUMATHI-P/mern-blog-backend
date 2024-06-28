import User from '../model/user.model.js'
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import { errorHandler } from '../utils/error.js';

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