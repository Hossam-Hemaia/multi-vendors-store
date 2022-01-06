const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const affilliateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Product",
    },
  ],
  privilege: {
    type: String,
    default: "marketer",
  },
  isCommissioned: {
    type: Boolean,
    default: false,
  },
});

affilliateSchema.methods.addToMarketingPlan = function (productId) {
  this.products.push(productId);
  return this.save();
};

affilliateSchema.methods.removeMarketingPlan = function (productId) {
  const newProducts = this.products.filter((p) => {
    return p.toString() != productId.toString();
  });
  this.products = newProducts;
  return this.save();
};

module.exports = mongoose.model("Affilliate", affilliateSchema);
