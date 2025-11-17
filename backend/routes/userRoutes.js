import express from 'express'
import { getUser, getAllUsers, createUser, updateUser } from '../controllers/userController.js'

const router = express.Router()

router.post('/users/login', getUser)    //login
router.get('/users', getAllUsers)       //get all users
router.post('/users', createUser)       //signup
router.put('/users/:id', updateUser)    //update user

export default router