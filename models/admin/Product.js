const mongoose = require("mongoose");

const Product = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  dose: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  outofstock: {
    type: Boolean,
    default: false,
  },

  pills: {
    type: Number,
    default: 1,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductTable = mongoose.model('Products', Product);
module.exports = ProductTable;   
