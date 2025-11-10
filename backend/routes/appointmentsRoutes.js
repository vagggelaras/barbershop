import express from 'express'
import { specificBarberDateAppointments, createAppointment } from '../controllers/appointmentsController.js'

const router = express.Router()

router.get('/appointments/:barber/:date', specificBarberDateAppointments)      
router.post('/appointments', createAppointment)

export default router