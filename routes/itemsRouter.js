import express from 'express'
import { getAllCategoryItems, getSalesItems, addOrder } from '../controllers/itemsController.js'

const router = express.Router()

router.get('/sales', getSalesItems)
router.get('/:category', getAllCategoryItems)
router.post('/cart', addOrder)


export default router