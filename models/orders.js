const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  client: {
    clientId: { type: Schema.Types.ObjectId, required: true, ref: "Client" },
  },
  products: [
    {
      productId: { type: Object, required: true },
      quantity: { type: Number, required: true },
      attributes: { type: Array },
      isWego: { type: Boolean, required: true },
      isShipped: { type: Boolean, default: false },
      isDelivered: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Orders", ordersSchema);
