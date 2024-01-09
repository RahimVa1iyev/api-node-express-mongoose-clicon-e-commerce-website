const Category = require('../models/Category')
const { StatusCodes } = require('http-status-codes')


const createCategory = async (req, res) => {
    const { name } = req.body

    const category = await Category.create({ name })

    res.status(StatusCodes.CREATED).json({ category })

}

const getAllCategory = async (req,res) =>{
    const categories = await Category.find({})// Populate the 'brands' field
    res.status(StatusCodes.OK).json({categories})
}

module.exports = {createCategory,getAllCategory}