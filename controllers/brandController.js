const NotFoundError = require('../errors/not-found')
const Brand = require('../models/Brand')
const Category = require('../models/Category')
const { StatusCodes } = require('http-status-codes')


const createBrand = async (req, res) => {
    const { name, categoryIds , features } = req.body
    console.log(features);
    console.log('category', categoryIds);

    const brand = await Brand.create({ name })

    const categories = await Category.find({ _id: { $in: categoryIds } });

    if (!categories) throw new NotFoundError(`Category not found by ids : ${categoryIds}`)

    brand.categories = categories.map(category => category._id);
    brand.features = features

    for (const category of categories) {
        category.brands.push(brand._id);
        await category.save();
    }
    await brand.save();
    res.status(StatusCodes.CREATED).json({ brand })
}

const updateBrand = async (req, res) => {
    const { id: brandId } = req.params
    const updatedBrand = await Brand.findOneAndUpdate({ _id: brandId} , req.body)
    if (req.body.categoryIds) {
        const categoryIds = req.body.categoryIds
        const categories = await Category.find({ _id: { $in: categoryIds } });
        if (!categories) throw new NotFoundError(`Category not found by ids : ${categoryIds}`)

        for (const category of categories) {
            category.brands.push(brand._id);
            await category.save();
        }
    }
}

const getAllBrand = async (req, res) => {
    const brands = await Brand.find({}).populate('categories', '_id name') // Projeksiyon ile sadece '_id' ve 'name' alanlarını al
        .exec();
    // Populate the 'brands' field
    res.status(StatusCodes.OK).json({ brands })
}

const deleteBrand = async (req, res) => {
    const { id: brandId } = req.params
    const brands = await Brand.findOneAndDelete({ _id: brandId })
    res.status(StatusCodes.OK).json({})
}

module.exports = { createBrand, getAllBrand, deleteBrand }