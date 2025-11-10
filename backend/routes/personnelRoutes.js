import express from 'express'
import { getAllPersonnel } from '../controllers/personnelController.js'

const router = express.Router()

router.get('/personnel', getAllPersonnel);

export default router