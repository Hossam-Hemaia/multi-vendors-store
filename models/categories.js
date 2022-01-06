const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  catEnglishName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Categories", categoriesSchema);
