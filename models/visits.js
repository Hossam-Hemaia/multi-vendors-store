const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitsSchema = new Schema({
  counter: {
    type: Number,
  },
});
const visits = mongoose.model("Visits", visitsSchema);

module.exports = visits;
