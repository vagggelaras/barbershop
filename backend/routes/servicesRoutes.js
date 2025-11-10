import express from 'express'
import { getAllServices } from '../controllers/servicesController.js'

const router = express.Router()

router.get('/services', getAllServices) // get all services

export default router