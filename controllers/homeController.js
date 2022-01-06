const Product = require("../models/product");
const Categories = require("../models/categories");
const Visits = require("../models/visits");

exports.getHomeProducts = async (req, res, next) => {
  try {
    let visitsCounter = await Visits.findOne({});
    if (!visitsCounter) {
      visitsCounter = new Visits({
        counter: 0,
      });
    }
    const categoreis = await Categories.find({});
    const products = [];
    for (let cat of categoreis) {
      let product = await Product.find({ category: cat.catEnglishName }).sort({
        _id: -1,
      });
      if (product.length > 0) {
        products.push({ product: product[0], cat: cat.categoryName });
      }
    }
    visitsCounter.counter++;
    visitsCounter.save();
    res.render("home", {
      pageTitle: "تاجر ستور",
      products: products,
      visits: visitsCounter.counter,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
