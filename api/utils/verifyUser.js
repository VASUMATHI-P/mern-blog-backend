import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if(!token)
    return res.status(401).json({message: "Unauthorized"})
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, user) => {
      if(err)
        return res.status(401).json({message: 'Invalid Token'})
      req.user = user;
    }
  )
  next();
}