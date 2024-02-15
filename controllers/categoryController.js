const Category = require('../models/Category')
const { StatusCodes } = require('http-status-codes')
const upload = require('../utils/upload')
const deleteImage = require('../utils/delete')


const createCategory = async (req, res) => {
    const {image} = req.files
    console.log(image);
    const result = await upload(image)
    console.log('result',result);
    const imageUrl = result.secure_url
    const category = await Category.create({...req.body , image : imageUrl})
    console.log('category',category);
    res.status(StatusCodes.CREATED).json({ category })
}

const updateCategory = async (req, res) => {
    const { id: categoryId } = req.params
    let updateFields = {}
    if (req.files) {
        const category = await Category.findById(categoryId);
        if (category && category.image) {
            await deleteImage(category.image);
        }
        const result = await upload(req.files.image)
        updateFields.image = result.secure_url
    }
    if (req.body) {
        updateFields.name = req.body.name;
        updateFields.features = req.body.featureIds
        updateFields.brands = req.body.brands
    }

    const updatedCategory = await Category.findOneAndUpdate({ _id: categoryId }, updateFields, { new: true, runValidators: true })

    if (!updatedCategory) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Category not found' });
    }

    res.status(StatusCodes.OK).json({ updatedCategory })

}

const getAllCategory = async (req, res) => {
    const categories = await Category.find({}).populate({path : 'features'}).populate({path : 'brands'}).populate({path : 'products' , select : 'name salePrice images description discountPercent bestDiscountPercent'})// Populate the 'brands' field
    res.status(StatusCodes.OK).json({ categories })
}

module.exports = { createCategory, getAllCategory ,updateCategory }