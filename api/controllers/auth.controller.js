import User from '../model/user.model.js'
import bcryptjs from 'bcryptjs';
export const signup = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }
  // Check if user exists
  const userExists = await User.findOne({ username });
  // if (userExists) {
  //   return res.status(401).json({ message: 'Username already exists' });
  // }
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
    res.status(400).json({ message: err.message });
  }

}