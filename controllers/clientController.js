const stripe = require("stripe")(
  "sk_test_51HfswkEOhvYlT1YsZme0NHkxRjeGvKAxFc6MqFV9ZaGD07LH9FXAXb4g6KGvu5TnCGK1WbQtXwSvnszUXEXgHQhQ00OPG1i8fS"
);
const Seller = require("../models/seller");
const Product = require("../models/product");
const Orders = require("../models/orders");
const Client = require("../models/client");
const Visits = require("../models/visits");
const Categories = require("../models/categories");
const ShippingFees = require("../models/shippingFees");

exports.getMarket = async (req, res, next) => {
  if (req.params.itemPerPage) {
    req.session.itemsPerPage = +req.params.itemPerPage;
  }
  if (req.params.productType) {
    req.session.productType = req.params.productType;
  }
  let ITEMS_PER_PAGE = req.session.itemsPerPage || 20;
  let page = +req.query.page || 1;
  let totalItems;
  try {
    let products;
    if (req.session.productType !== "all") {
      let productCat = req.session.productType;
      totalItems = await Product.find({
        published: true,
        category: productCat,
      }).countDocuments();
      products = await Product.find({ published: true, category: productCat })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    } else {
      totalItems = await Product.find({
        published: true,
      }).countDocuments();
      products = await Product.find({ published: true })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    }
    if (!products) {
      res.redirect("/");
    }
    const visitsCounter = await Visits.findOne({});
    visitsCounter.counter++;
    visitsCounter.save();
    res.status(200).render("client/market", {
      pageTitle: "Market",
      products,
      itemPerPage: ITEMS_PER_PAGE,
      currentPage: page,
      hasNextPage: page * ITEMS_PER_PAGE < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      visits: visitsCounter.counter,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getProductDetails = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    const products = await Product.find({
      published: true,
      category: product.category,
    });
    if (!product) {
      res.redirect("/market");
    }
    res.status(200).render("client/details", {
      pageTitle: "Product Details",
      product,
      products,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getAddToCart = async (req, res, next) => {
  const productId = req.params.productId;
  const color = req.body.color || "";
  const size = req.body.size || "";
  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.redirect("/market");
    }
    req.client.addToCart(product, color, size);
    ++req.session.cartCounter;
    let counter = req.session.cartCounter;
    const io = require("../socket").getIO();
    io.emit("addedToCart", { counter });
    res.json({ message: "Added to cart" });
  } catch (err) {
    console.log(err);
    res.status(422).json({ message: "Add to cart faild" });
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const client = await req.client
      .populate("cart.items.productId")
      .execPopulate();
    const products = client.cart.items;
    res.render("client/cart", {
      pageTitle: "Client Cart",
      products,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postDeleteCartItem = async (req, res, next) => {
  const productId = req.body.productId;
  const designQuantity = req.body.designQuantity;
  try {
    await req.client.removeCartItem(productId);
    req.session.cartCounter -= designQuantity;
    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getCheckOut = async (req, res, next) => {
  let products;
  let total = 0;
  try {
    const client = await req.client
      .populate("cart.items.productId")
      .execPopulate();
    products = client.cart.items;
    products.forEach((p) => {
      total += p.quantity * p.productId.price;
    });
    res.status(201).render("client/checkOut", {
      pageTitle: "Checkout Orders",
      products: products,
      totalSum: total,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getCheckOutSuccess = async (req, res, next) => {
  try {
    const client = await req.client
      .populate("cart.items.productId")
      .execPopulate();
    const products = await Promise.all(
      client.cart.items.map(async (p) => {
        let soldProduct = await Product.findById(p.productId._id);
        let productDetails = await soldProduct
          .populate("sellerId")
          .execPopulate();
        let wegoShipping = productDetails.sellerId.wegoShipping;
        return {
          productId: { ...p.productId._doc },
          quantity: p.quantity,
          attributes: p.attributes,
          isWego: wegoShipping,
        };
      })
    );
    const order = new Orders({
      client: {
        clientId: client._id,
      },
      products: products,
    });
    await order.save();
    products.forEach(async (p) => {
      let soldProduct = await Product.findById(p.productId._id);
      soldProduct.soldCounter += p.quantity;
      soldProduct.stock -= p.quantity;
      let amount = soldProduct.price * p.quantity;
      await Seller.updateOne(
        { _id: p.productId.sellerId },
        { $inc: { balance: amount } }
      );
      await soldProduct.save();
    });
    req.session.cartCounter = 0;
    await req.client.clearCart();
    res.json({ url: "/orders" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Orders.find({ "client.clientId": req.client._id });
    if (!orders) {
      res.redirect("/market");
    }
    res
      .status(200)
      .render("client/orders", { pageTitle: "Orders", orders: orders });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postProductRating = async (req, res, next) => {
  const { productId, rating } = req.body;
  try {
    if (req.session.isRating < 5) {
      const product = await Product.findById(productId);
      ++product.raterCounter;
      const ratingValue = parseFloat(rating);
      product.ratingAccumelation += ratingValue;
      let ratingAverage = product.ratingAccumelation / product.raterCounter;
      console.log(ratingAverage, ratingValue);
      if (Math.ceil(ratingAverage) - ratingAverage > 0.5) {
        product.rating = Math.floor(ratingAverage);
      } else if (
        Math.ceil(ratingAverage) - ratingAverage < 0.5 &&
        Math.ceil(ratingAverage) - ratingAverage > 0
      ) {
        product.rating = Math.ceil(ratingAverage);
      } else if (Math.ceil(ratingAverage) - ratingAverage === 0.5) {
        product.rating = ratingAverage;
      } else if (
        Math.ceil(ratingAverage) - ratingAverage < 0.5 &&
        Math.ceil(ratingAverage) - ratingAverage === 0
      ) {
        product.rating = ratingAverage;
      }
      ++req.session.isRating;
      await product.save();
      res.status(201).json({ message: "success" });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getClientProfile = async (req, res, next) => {
  try {
    const client = await Client.findById(req.client._id);
    res.status(200).render("client/profile", {
      pageTitle: "حسابى",
      hasError: false,
      currentClient: client,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postConfirmProfile = async (req, res, next) => {
  const { name, phoneNumber, address, email, clientId } = req.body;
  try {
    const client = await Client.findById(clientId);
    client.name = name;
    client.phoneNumber = phoneNumber;
    client.address = address;
    client.email = email;
    await client.save();
    res.status(201).redirect("/market/all");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getShowList = async (req, res, next) => {
  try {
    const categories = await Categories.find({}).sort({ categoryName: 1 });
    res.status(201).json({ categories: categories });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getShippingTable = async (req, res, next) => {
  try {
    const shippingFees = await ShippingFees.find({});
    res.status(201).render("client/shippingFeesTable", {
      pageTitle: "اسعار الشحن للمحافظات",
      fees: shippingFees,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getAboutUs = (req, res, next) => {
  try {
    res.status(200).render("client/aboutUs", { pageTitle: "عن الموقع" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getContactUs = (req, res, next) => {
  try {
    res.status(200).render("client/contactUs", { pageTitle: "اتصل بنا" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
