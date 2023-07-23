const mongoose = require("mongoose");

let productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "please enter product name"],
    },
    imageUrl: {
      type: String,
      required: [true, "please upload product image"],
    },
    productDescription: {
      type: String,
      required: [true, "please enter product description"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    productPrice: {
      type: String,
      required: [true, "please enter product price"],
    },
    numberInStock: {
      type: Number,
      required: [true, "please enter number in stock"],
    },
    cloudinary_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;