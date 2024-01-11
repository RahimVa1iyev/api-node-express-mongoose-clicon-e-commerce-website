
const express = require('express')
const router = express.Router()

const {getFeatures,createFeature} =require('../controllers/featureController')

const {authenticateUser,authorizePermission} = require('../middlewares/authentication')


router.route('/').post(createFeature).get(getFeatures)




module.exports = router