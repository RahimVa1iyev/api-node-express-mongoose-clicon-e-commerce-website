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

    res.status(StatusCodes.CREATED).json({ id : product._id })
}


const getAllProducts = async (req, res) => {
    const products = await Product.find({}).populate({
        path: 'categoryId',
        select: 'name id' // categoryId'nin 'name' ve 'id' alanlarını getir
    })
        .populate({
            path: 'brandId',
            select: 'name id' // brandId'nin 'name' ve 'id' alanlarını getir
        });

    res.status(StatusCodes.OK).json({ products })
}

const getBestDealsProducts = async (req, res) => {
    const products = await Product.find({ bestDiscountPercent: { $gt: 0 } })
    res.status(StatusCodes.OK).json({ products })
}
const getFeaturedProducts = async (req, res) => {
    const products = await Product.find({ isFeature: true })
    res.status(StatusCodes.OK).json({ products })
}
const getBestSellerProducts = async (req, res) => {
    const products = await Product.find({ sellerCount: { $gt: 0 } }).sort({rate : -1})
    res.status(StatusCodes.OK).json({ products })
}
const getMostViewProducts = async (req, res) => {
    const products = await Product.find({ viewCount: { $gt: 0 } }).sort({rate : -1})
    res.status(StatusCodes.OK).json({ products })
}
const topRatedProducts = async (req,res) =>{
    const products = await Product.find({rate : {$gt:0}}).sort({rate : -1})
}

const filterAndSortProducts = async (req, res) => {
    const { categoryId, brandId, min_price, max_price, page, page_size, name, price } = req.query;
    //    filter options
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (brandId) filter.brandId = brandId;
    if (min_price) filter.salePrice = { $gte: parseFloat(min_price) };
    if (max_price) {
        if (!filter.salePrice) filter.salePrice = {};
        filter.salePrice.$lte = parseFloat(max_price);
    }

    // sort options
    const sortOptions = {};
    if (name === 'a-z') sortOptions.name = 1;
    if (name === 'z-a') sortOptions.name = -1;
    if (price === 'most') sortOptions.salePrice = 1;
    if (price === 'least') sortOptions.salePrice = -1;

    // Calculate pagination
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(page_size) || 2;
    const skipItems = (currentPage - 1) * itemsPerPage;

    // Query MongoDB with filters and pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const products = await Product.find(filter).sort(sortOptions).skip(skipItems).limit(itemsPerPage);

    // Generate next and prev links
    const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl;
    const nextUrl = currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : null;
    const prevUrl = currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null;

    res.status(StatusCodes.OK).json({
        totalProducts,
        totalPages,
        currentPage,
        pageSize: itemsPerPage,
        next: nextUrl,
        prev: prevUrl,
        products
    });
}

const filterProductsInDetail = async (req, res) => {
    const { seriaNo } = req.params;
    const query = req.query;

    const products = await Product.find({ seriaNo: seriaNo });

    const filteredProducts = products.filter((product) => {
        for (const key in query) {
            if (!product.features.find((feature) => feature.name === key && feature.option === query[key])) {
                return false;
            }
        }
        return true;
    });

    const product = filteredProducts[0]
    res.status(StatusCodes.OK).json({product})
};


const getProductById = async (req, res) => {
    const { id: productId } = req.params
    const product = await Product.findOne({ _id: productId }).populate({
        path: 'categoryId',
        select: 'name id' // categoryId'nin 'name' ve 'id' alanlarını getir
    })
        .populate({
            path: 'brandId',
            select: 'name id' // brandId'nin 'name' ve 'id' alanlarını getir
        });

    if (!product) throw new NotFoundError(`Product not found by Id : ${productId}`)
    const relatedProducts = await Product.find({ categoryId: product.categoryId._id })
    res.status(StatusCodes.OK).json({ product, relatedProducts })
}

const uploadImage = async (req, res) => {
    const { productId } = req.params
    console.log(req.files.images);

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

module.exports = { uploadImage, createProduct, getAllProducts, getBestDealsProducts, getFeaturedProducts, getBestSellerProducts, getMostViewProducts, getProductById,topRatedProducts, filterAndSortProducts,filterProductsInDetail }