const mongoose = require("mongoose");
const addToCartSchema = new mongoose.Schema({
    productId: {
        type: String, 
      },
      userId: {
        type: String, 
      }, 
      createAt: {
        type: Date,
        default: Date.now // Corrected to call `Date.now` as a function reference
      },
      updatedAt: {
        type: Date,
        default: Date.now // Same correction here
      }
});

const addToCartTable=mongoose.model('addToCartsy',addToCartSchema);
module.exports = addToCartTable;

 