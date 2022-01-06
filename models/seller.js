const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
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
  wegoShipping: {
    type: Boolean,
    default: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  withdrawHistory: [
    {
      withdrawAmount: { type: Number },
      withdrawDate: { type: Date, default: Date.now() },
      withdrawStatus: { type: String, default: "Pending" },
    },
  ],
  resetToken: String,
  resetTokenExpirationDate: Date,
  password: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  privilege: {
    type: String,
    default: "user",
  },
  commissionRate: {
    type: Number,
  },
});

sellerSchema.methods.updateWithdrawHistory = function (amount, status) {
  let obj = {};
  obj.withdrawAmount = amount;
  if (status !== "Pending") {
    obj.withdrawStatus = status;
  }
  this.withdrawHistory.push(obj);
  return this.save();
};

module.exports = mongoose.model("Seller", sellerSchema);
