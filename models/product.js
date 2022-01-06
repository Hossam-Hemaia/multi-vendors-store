const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  shippingFees: {
    type: Number,
    default: 0,
  },
  marketerCommission: {
    type: Number,
    default: 0,
  },
  imagePath: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  soldCounter: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  colors: {
    type: Array,
  },
  sizes: {
    type: Array,
  },
  details: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  raterCounter: {
    type: Number,
    default: 0,
  },
  ratingAccumelation: {
    type: Number,
    default: 0,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  sellerName: {
    type: String,
  },
  monitor: {
    type: Boolean,
    default: false,
  },
  shippingByweGo: {
    type: Boolean,
    default: false,
  },
  dateAdded: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
