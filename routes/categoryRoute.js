const express = require('express')
const router = express.Router()
const {createCategory,getAllCategory,updateCategory} = require('../controllers/categoryController')

const {authenticateUser,authorizePermission} = require('../middlewares/authentication')


router.route('/').post(createCategory).get(getAllCategory)
router.route('/:id').patch(updateCategory)




module.exports = router