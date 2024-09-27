const express = require("express");

const {
  createProducts,
  getAllProducts,
  singleProducts,
  deleteProduct,
  updateProducts,
  getTopProducts,
} = require("../controllers/productControllers");

const {protect, admin} = require('../middleware/authMiddleware')

const router = express.Router();


router.post('/createProducts', protect, admin, createProducts)
router.get('/getAllProducts', getAllProducts),
router.get('/singleProduct/:id', singleProducts)
router.delete('/deleteProduct/:id', protect, admin, deleteProduct)
router.put('/updateProducts/:id', protect, admin, updateProducts)
router.get('/getTopProducts', getTopProducts)


module.exports = router