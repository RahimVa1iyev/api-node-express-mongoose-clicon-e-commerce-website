const NotFoundError = require('../errors/not-found')
const Brand = require('../models/Brand')
const Category = require('../models/Category')
const { StatusCodes } = require('http-status-codes')


const createBrand = async (req, res) => {
    const { name , categoryIds } = req.body

    const brand = await Brand.create({ name })

    const categories = await Category.find({_id: {$in: categoryIds}});

    if(!categories) throw new NotFoundError(`Category not found by ids : ${categoryIds}`)

    brand.categories = categories.map(category => category._id);
    await brand.save();
    res.status(StatusCodes.CREATED).json({ brand })

}

const getAllBrand = async (req,res) =>{
    const brands = await Brand.find({}).populate('categories', '_id name') // Projeksiyon ile sadece '_id' ve 'name' alanlarını al
    .exec();
 // Populate the 'brands' field
    res.status(StatusCodes.OK).json({brands})
}

module.exports = {createBrand,getAllBrand}