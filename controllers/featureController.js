const Category = require('../models/Category')
const Feature = require('../models/Feature')
const {StatusCodes} = require('http-status-codes')

const createFeature = async (req,res) =>{
    const {name , options, categoryIds} = req.body
    const feature = await Feature.create({name,options})
    const categories = await Category.find({ _id: { $in: categoryIds } });
console.log('categ',categories);
    feature.categories = categories.map(category => category._id);

    for (const category of categories) {
        category.features.push(feature._id);
        await category.save();
    }
    await feature.save();

    res.status(StatusCodes.CREATED).json({feature})
}

const getFeatures = async (req,res) =>{
    const features = await Feature.find({})
    res.status(StatusCodes.OK).json({features})
}

module.exports = {getFeatures,createFeature}