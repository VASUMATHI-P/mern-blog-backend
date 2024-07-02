import express from 'express';
import { test, updateUser, deleteUser, signout, getUsers } from '../controllers/user.controller.js';
import { verifyUser } from "../utils/verifyUser.js"

const router = express.Router();

router.get('/test', test)
router.put('/update/:id', verifyUser, updateUser)
router.delete('/delete/:id', verifyUser, deleteUser);
router.post('/signout', signout)
router.get('/getusers', verifyUser, getUsers)

export default router;