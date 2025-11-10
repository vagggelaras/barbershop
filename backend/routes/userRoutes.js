import express from 'express'
import { getUser, getAllUsers, createUser } from '../controllers/userController.js'

const router = express.Router()

router.post('/users/login', getUser)    //login
router.get('/users', getAllUsers)       //signup
router.post('/users', createUser)       //get all users

export default router