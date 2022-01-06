const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const affOrdersSchema = new Schema({
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  marketerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Affilliate",
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  orderDetails: [
    {
      clientName: { type: String, required: true },
      clientNumber: { type: String, required: true },
      address: { type: String, required: true },
      region: { type: String, required: true },
      productTitle: { type: String, required: true },
      quantity: { type: Number, required: true },
      productDescription: { type: String },
      price: { type: Number, required: true },
      isWego: { type: Boolean, required: true },
      isShipped: { type: Boolean, default: false },
      sellerName: { type: String, required: true },
      isDelivered: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("AffOrder", affOrdersSchema);
