const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const v = require("validator");
const {Review} = require("./reviewModel")
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },  

imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (url) => {
        if (!v.isURL(url)) {
          throw new Error("url: not valid");
        }
      },
    },
  },
price: {
    type: Number,
    required: true,
  },
category: {
    type: String,
    required: true,
  },

  review: [{type: mongoose.Types.ObjectId,
    ref: Review}],

  cart: {
    items: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        qty: {
            type: Number,
            required: true
        }
    }],
    totalPrice: Number
}
  
/* createdAt: {
    type: Date,
    required: true,
  }, */
  
});

ProductSchema.methods.addToCart = async function(productId) {
  const product = await Product.findById(productId);
  if (product) {
      const cart = this.cart;
      const isExisting = cart.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(product._id).trim());
      if (isExisting >= 0) {
          cart.items[isExisting].qty += 1;
      } else {
          cart.items.push({ productId: product._id, qty: 1 });
      }
      if (!cart.totalPrice) {
          cart.totalPrice = 0;
      }
      cart.totalPrice += product.price;
      return this.save();
  }

};



module.exports = mongoose.model("Product", ProductSchema);