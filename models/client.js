const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  region: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpirationDate: Date,
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        attributes: [
          {
            color: { type: String, default: "" },
            size: { type: String, default: "" },
            quantity: { type: Number, default: 0 },
          },
        ],
      },
    ],
  },
});

clientSchema.methods.addToCart = function (product, color, size) {
  if (product.stock > 0) {
    const productIndex = this.cart.items.findIndex((productIdx) => {
      if (productIdx.productId.toString() === product._id.toString()) {
        return productIdx;
      }
    });
    let newQuantity = 1;
    let newCartItems = [...this.cart.items];
    if (productIndex >= 0) {
      newQuantity = this.cart.items[productIndex].quantity + 1;
      newCartItems[productIndex].quantity = newQuantity;
      let attribs = [...this.cart.items[productIndex].attributes];
      if (color !== "") {
        let attribIdx = attribs.findIndex((idx) => {
          if (idx.color === color) {
            return idx;
          }
        });
        if (attribIdx >= 0 && attribs[attribIdx].size === size) {
          attribs[attribIdx].quantity += 1;
        } else {
          attribs.push({ color: color, size: size, quantity: 1 });
        }
      } else if (size !== "") {
        let attribIdx = attribs.findIndex((idx) => {
          if (idx.size === size) {
            return idx;
          }
        });
        if (attribIdx >= 0 && attribs[attribIdx].color === color) {
          attribs[attribIdx].quantity += 1;
        } else {
          attribs.push({ color: color, size: size, quantity: newQuantity });
        }
      }
      newCartItems[productIndex].attributes = attribs;
    } else {
      newCartItems.push({
        productId: product._id,
        quantity: newQuantity,
        attributes: [{ color: color, size: size, quantity: 1 }],
      });
    }
    const updatedCart = { items: newCartItems };
    this.cart = updatedCart;
    return this.save();
  }
};

clientSchema.methods.removeCartItem = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

clientSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = new mongoose.model("Client", clientSchema);
