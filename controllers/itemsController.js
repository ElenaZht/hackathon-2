import { getItemsFromDB, getSalesFromDB, addOrderToDB } from '../models/itemsModel.js'

export const getAllCategoryItems = async(req, res) => {
    try {
        const category = req.params.category
        const itemsOfCategory = await getItemsFromDB(category)
        if (itemsOfCategory){
            res.status(200).json(itemsOfCategory)
        } else {
            res.status(404).json({"message": "category not found"})
        }

    } catch (error) {
       console.error(error)
       res.status(500).json({"message": "something get wrong"})
    }
}

export const getSalesItems = async(req, res) => {
    try {
        const itemsOfCategory = await getSalesFromDB()
        if (itemsOfCategory){
            res.status(200).json(itemsOfCategory)
        } else {
            res.status(404).json({"message": "sales not found"})
        }

    } catch (error) {
       console.error(error)
       res.status(500).json({"message": "something get wrong"})
    }
}

export const addOrder = async(req, res) => {
    try {
        const orderId = await addOrderToDB(req.body)
        if (orderId){
            res.status(200).json({"message": "order added successfuly", "orderId": orderId})
        } else {
            res.status(500).json({"message": "failed to add order"})
        }
    } catch (error) {
        res.status(500).json({"message": "server error"})
    }
}