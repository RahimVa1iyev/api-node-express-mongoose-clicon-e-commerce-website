const Product = require('../models/Product')
const Category = require('../models/Category')
const Brand = require('../models/Brand');
const Feature = require('../models/Feature');

const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const { StatusCodes } = require('http-status-codes');

const cloudinary = require('cloudinary').v2

const createProduct = async (req, res) => {
    const { categoryId, brandId } = req.body;

    const existCategory = await Category.findOne({ _id: categoryId })
    if (!existCategory) throw new NotFoundError(`Category not found by id: ${categoryId}`)

    const existBarnd = await Brand.findOne({ _id: brandId })
    if (!existBarnd) throw new NotFoundError(`Category not found by id: ${brandId}`)

    const product = await Product.create(req.body)

    res.status(StatusCodes.CREATED).json({ product })

}

const uploadImage = async (req, res) => {
    const {productId} = req.params
    if (!req.files) {
        throw new BadRequestError('No file uploaded')
    }

    const productImages = req.files.image
    const maxSize = 2 * 1024 * 1024
    const uploadedImages = [];

    for (const image of productImages) {
        if (!image.mimetype.startsWith('image')) {
            throw new BadRequestError('Only image upload');
        }

        if (image.size > maxSize) {
            throw new BadRequestError('Please upload images smaller than 2MB');
        }

        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            use_filename: true,
            folder: 'clicon',
        });

        uploadedImages.push(result.secure_url);
    }

    const product = await Product.findOne({_id:productId})
    product.images = uploadedImages

    product.save()

    res.status(StatusCodes.CREATED).json({product})

    
}

module.exports = { uploadImage, createProduct }