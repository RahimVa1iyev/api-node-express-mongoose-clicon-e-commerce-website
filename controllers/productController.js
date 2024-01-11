const Product = require('../models/Product')
const Category = require('../models/Category')
const Brand = require('../models/Brand');
const Feature = require('../models/Feature');

const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');

const path = require('path')
const createProduct = async (req,res) =>{
    const { categoryId, brandId } = req.body;

    const existCategory = await Category.findOne({_id:categoryId})
    if(!existCategory)  throw new NotFoundError(`Category not found by id: ${categoryId}`)

    const existBarnd = await Brand.findOne({_id:brandId})
    if(!existBarnd)  throw new NotFoundError(`Category not found by id: ${brandId}`)

    const product = await Product.create(req.body)

}

