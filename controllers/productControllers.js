const Product = require("../models/productModel");

const createProducts = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      images,
      category,
      quantity,
      rating,
    } = req.body;

    if (!name || !price || !category || !quantity) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const products = await Product.create({
      name,
      price,
      description,
      image,
      images,
      category,
      quantity,
      rating,
    });

    if (!products) {
      res.status(400).json({ message: "invalid product data" });
    }

    if (products) {
      res
        .status(201)
        .json({ message: "product created successfully", products });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "product could not be created", error: error.message });
  }
};

const singleProducts = async (req, res) => {
  try {
    const singleProduct = await Product.findById(req.params.id);

    if (!singleProduct) {
      return res.status(400).json({ message: "product not found" });
    }
    return res.status(200).json({ message: "product found", singleProduct });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "invalid product", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});

    if (allProducts.length === 0) {
      return res.status(400).json({ message: "no products found" });
    }

    return res.status(200).json({ message: "all products found", allProducts });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "products invalid", error: error.message });
  }
};

const updateProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: "product not found" });
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.image = req.body.image || product.image;
    product.images = req.body.images || product.images;
    product.category = req.body.category || product.category;
    product.quantity = req.body.quantity || product.quantity;
    product.rating = req.body.rating || product.rating;

    await product.save();

    res.status(201).json({ message: "product updated succesfully", product });
  } catch (error) {
    res.status(400).json({ message: "error occured", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(400).json({ message: "product not found" });
    }
    return res
      .status(201)
      .json({ message: "product deleted successfully", product });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error occured", error: error.message });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Product.find({}).sort({ rating: -1 });

    if (!topProducts || topProducts === 0) {
      return res.status(404).json({ message: "top products not found" });
    }

    return res
      .status(201)
      .json({ message: "top products gotten successfully", topProducts });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error occured", error: error.message });
  }
};

module.exports = {
  createProducts,
  singleProducts,
  getAllProducts,
  updateProducts,
  deleteProduct,
  getTopProducts,
};
