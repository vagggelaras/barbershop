import express from 'express'
import { getAllClosedDays } from '../controllers/closedDaysController.js'

const router = express.Router()

router.get('/closedDays', getAllClosedDays);

export default router