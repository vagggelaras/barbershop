import express from 'express'
import { getAllClosedDays, createClosedDay, deleteClosedDay } from '../controllers/closedDaysController.js'

const router = express.Router()

router.get('/closedDays', getAllClosedDays);
router.post('/closedDays', createClosedDay);
router.delete('/closedDays/:id', deleteClosedDay);

export default router