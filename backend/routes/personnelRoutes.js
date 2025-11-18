import express from 'express'
import {
    getAllPersonnel,
    getPersonnelById,
    createPersonnel,
    updatePersonnel,
    deletePersonnel
} from '../controllers/personnelController.js'

const router = express.Router()

router.get('/personnel', getAllPersonnel);
router.get('/personnel/:id', getPersonnelById);
router.post('/personnel', createPersonnel);
router.put('/personnel/:id', updatePersonnel);
router.delete('/personnel/:id', deletePersonnel);

export default router