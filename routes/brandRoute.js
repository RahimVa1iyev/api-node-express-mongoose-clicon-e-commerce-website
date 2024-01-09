const express = require('express')
const router = express.Router()
const {createBrand,getAllBrand} = require('../controllers/brandController')

const {authenticateUser,authorizePermission} = require('../middlewares/authentication')


router.route('/').post([authenticateUser,authorizePermission('admin')] ,createBrand).get(getAllBrand)




module.exports = router