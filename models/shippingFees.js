const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shippingFeesSchema = new Schema({
  region: {
    type: String,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("ShippingFees", shippingFeesSchema);
