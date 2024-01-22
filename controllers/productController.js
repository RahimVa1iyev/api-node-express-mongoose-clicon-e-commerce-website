const Product = require('../models/Product')
const Category = require('../models/Category')
const Brand = require('../models/Brand');
const Feature = require('../models/Feature');

const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const { StatusCodes } = require('http-status-codes');
const upload = require('../utils/upload');


const createProduct = async (req, res) => {
    const { categoryId, brandId } = req.body;

    const existCategory = await Category.findOne({ _id: categoryId })
    if (!existCategory) throw new NotFoundError(`Category not found by id: ${categoryId}`)

    const existBarnd = await Brand.findOne({ _id: brandId })
    if (!existBarnd) throw new NotFoundError(`Category not found by id: ${brandId}`)

    const product = await Product.create(req.body)

    existCategory.products = product._id
    existBarnd.products = product._id

    existCategory.save()
    existBarnd.save()

    res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req,res) =>{
    const products = await Product.find({}).populate({
        path: 'categoryId',
        select: 'name id' // categoryId'nin 'name' ve 'id' alanlarını getir
    })
    .populate({
        path: 'brandId',
        select: 'name id' // brandId'nin 'name' ve 'id' alanlarını getir
    });
    console.log(products);

    res.status(StatusCodes.OK).json({products})
}

const getBestDealsProducts = async (req,res) =>{
    const products = await Product.find({bestDiscountPercent : {$gt :0}})
    res.status(StatusCodes.OK).json({products})
}
const getFeaturedProducts = async (req,res) =>{
    const products = await Product.find({isFeature : true})
    res.status(StatusCodes.OK).json({products})
}
const getBestSellerProducts = async (req,res) =>{
    const products = await Product.find({sellerCount : {$gt:0}})
    res.status(StatusCodes.OK).json({products})
}
const getMostViewProducts = async (req,res) =>{
    const products = await Product.find({viewCount : {$gt:0}})
    res.status(StatusCodes.OK).json({products})
}
const getNewProducts = async (req,res) =>{
    const products = await Product.find({isNew :true})
    res.status(StatusCodes.OK).json({products})
}

const uploadImage = async (req, res) => {
    const { productId } = req.params

    if (!req.files) {
        throw new BadRequestError('No file uploaded')
    }

    const uploadedImages = [];
        const productImages = req.files.images

        for (const image of productImages) {
            const result = await upload(image)
            uploadedImages.push({ imageStatus: false, imageUrl: result.secure_url });
        }

        const result = await upload(req.files.image)
        uploadedImages.push({ imageStatus: true, imageUrl: result.secure_url });


    const product = await Product.findOne({ _id: productId })
    product.images = uploadedImages

    product.save()

    res.status(StatusCodes.CREATED).json({ product })

}

module.exports = { uploadImage, createProduct ,getAllProducts,getBestDealsProducts,getFeaturedProducts,getBestSellerProducts,getMostViewProducts }