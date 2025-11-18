import express from 'express'
import { getAllServices, createService, updateService, deleteService } from '../controllers/servicesController.js'

const router = express.Router()

router.get('/services', getAllServices) // get all services
router.post('/services', createService) // create service
router.put('/services/:id', updateService) // update service
router.delete('/services/:id', deleteService) // delete service

export default router