const Product = require("../models/product.model");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const upload = require("../utils/multer");

module.exports.handle_new_product = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ errorMessage: "Please upload product image" });
    }

    const product = await Product.findOne({
      productName: req.body.productName,
    });
    if (product) {
      return res.status(404).json({ errorMessage: "Product already exist" });
    }

    const upload_response = await cloudinary.uploader.upload(req.file.path);

    if (upload_response) {
      const newProduct = new Product({
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        numberInStock: req.body.numberInStock,
        imageUrl: upload_response.url,
        cloudinary_id: upload_response.public_id,
      });

      newProduct
        .save()
        .then(() => {
          return res
            .status(200)
            .json({ successMessage: "Product saved successfully" });
        })
        .catch((error) => {
          return res.status(500).json({
            errorMessage:
              "Something went wrong while saving product. Please try again later",
          });
        });
    }
  } catch (error) {
    return res.status(500).json({
      errorMessage: "Something went wrong. Please try again later",
    });
  }
};

module.exports.get_all_products = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(500).json({ errorMessage: "Product not available" });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        "Something went wrong while fetching products. Please try again later",
    });
  }
};

module.exports.get_one_product = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid product ID" });
  }
  try {
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).json({ errorMessage: "Product does not exist" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again later." });
  }
};


module.exports.update_product = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid product ID" });
  }
  try {
    let product = await Product.findById(req.params.id);
    await cloudinary.uploader.destroy(product.cloudinary_id);

    let result;

    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }

    const data = {
      productName: req.body.productName || product.productName,
      productDescription:
        req.body.productDescription || product.productDescription,
      productPrice: req.body.productPrice || product.productPrice,
      isPublished: req.body.isPublished || product.isPublished,
      numberInStock: req.body.numberInStock || product.numberInStock,
      imageUrl: result?.secure_url || product.imageUrl,
      cloudinary_id: result?.public_id || product.cloudinary_id,
    };

    product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ errorMessage: "Product not found" });
    }

    return res.status(200).json({
      successMessage: "Product was successfully updated",
    });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something went wrong" });
  }
};



module.exports.delete_product = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid product ID" });
  }
  try {
    let product = await Product.findById(_id);
    await cloudinary.uploader.destroy(product.cloudinary_id);
    await product.remove();
    return res.status(200).json({
      successMessage: "Product was successfully removed",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again." });
  }
};

module.exports.get_published_products = async (req, res) => {
  const query = req.query.published;
  try {
    const products = query
      ? await Product.find({ isPublished }).sort({ _id: -1 })
      : await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        error.message ||
        "Something went wrong while retrieving published products",
    });
  }
};
