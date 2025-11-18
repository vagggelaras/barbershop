import express from 'express'
import {
    specificBarberDateAppointments,
    getAllAppointmentsByDate,
    getAllAppointments,
    createAppointment,
    deleteAppointment,
    getUserAppointments
} from '../controllers/appointmentsController.js'

const router = express.Router()

router.get('/appointments', getAllAppointments)
router.get('/appointments/date/:date', getAllAppointmentsByDate)
router.get('/appointments/user/:email', getUserAppointments)  // BEFORE the generic :barber/:date
router.get('/appointments/:barber/:date', specificBarberDateAppointments)  // AFTER specific routes
router.post('/appointments', createAppointment)
router.delete('/appointments/:id', deleteAppointment)

export default router