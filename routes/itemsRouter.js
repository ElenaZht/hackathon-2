import express from 'express'
import { getAllCategoryItems, getSalesItems } from '../controllers/itemsController.js'

const router = express.Router()

router.get('/sales', getSalesItems)
router.get('/:category', getAllCategoryItems)


export default router