const fs = require("fs");
const Affilliate = require("../models/affilliate");
const AffOrders = require("../models/affOrders");
const Product = require("../models/product");
const utilities = require("../utils/utilities");
const zip = require("express-zip");
const path = require("path");

exports.getDashBoard = async (req, res, next) => {
  try {
    const products = [];
    for (let productId of req.marketer.products) {
      let product = await Product.findById(productId);
      products.push(product);
    }
    const checkProducts = products.filter((p) => {
      if (p !== null) {
        return p;
      }
    });
    res.status(200).render("admin/marketerDashBoard", {
      pageTitle: "Dash Board",
      marketerId: req.marketer._id,
      products: checkProducts || [],
      marketerName: req.marketer.name,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next();
  }
};

exports.getCopyLink = async (req, res, next) => {
  const productId = req.params.productId;
  const marketerId = req.marketer._id;
  try {
    const marketer = await Affilliate.findById(marketerId);
    await marketer.addToMarketingPlan(productId);
    let linkString = `${req.get(
      "host"
    )}/market/productDetails/${productId}/${marketerId}`;
    res.status(201).json({ link: linkString });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next();
  }
};

exports.deleteProductPlan = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const marketer = await Affilliate.findById(req.marketer._id);
    await marketer.removeMarketingPlan(productId);
    res.status(201).json({ message: "success" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next();
  }
};

exports.getAddOrder = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    res
      .status(200)
      .render("admin/addOrder", { pageTitle: "اضافة اوردر", product: product });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next();
  }
};

exports.postMarketerCreateOrder = async (req, res, next) => {
  const orderArr = [];
  const productId = req.body.productId;
  try {
    const product = await Product.findById(productId);
    const productDetails = await product.populate("sellerId").execPopulate();
    const sellerName = productDetails.sellerId.name;
    if (!Array.isArray(req.body.clientName)) {
      let orderObj = {
        clientName: req.body.clientName,
        clientNumber: req.body.clientNumber,
        address: req.body.address,
        region: req.body.region,
        productTitle: req.body.productName,
        quantity: req.body.quantity,
        productDescription: req.body.specs,
        price: product.price,
        isWego: true,
        isShipped: false,
        sellerName: sellerName,
      };
      orderArr.push(orderObj);
    } else {
      const pkgArrLength = req.body.clientName.length;
      for (let i = 0; i < pkgArrLength; ++i) {
        let orderObj = {
          clientName: req.body.clientName[i],
          clientNumber: req.body.clientNumber[i],
          address: req.body.address[i],
          region: req.body.region[i],
          productTitle: req.body.productName[i],
          quantity: req.body.quantity[i],
          productDescription: req.body.specs[i],
          price: product.price,
          isWego: true,
          isShipped: false,
          sellerName: sellerName,
        };
        orderArr.push(orderObj);
      }
    }

    const marketerOrder = new AffOrders({
      marketerId: req.marketer._id,
      productId: productId,
      orderDetails: orderArr,
    });
    await marketerOrder.save();
    res.status(201).redirect("/marketer/dashBoard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next();
  }
};

exports.getMarketerOrders = (req, res, next) => {
  try {
    res
      .status(200)
      .render("admin/marketerOrders", { pageTitle: "تقرير الطلبات" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next();
  }
};

exports.postMarketerOrdersReport = async (req, res, next) => {
  const { dateFrom, dateTo } = req.body;
  try {
    const isoDateFrom = utilities.toIsoDate(dateFrom, "start");
    const isoDateTo = utilities.toIsoDate(dateTo, "");
    const orders = await AffOrders.find({
      orderDate: { $gte: isoDateFrom, $lte: isoDateTo },
      marketerId: req.marketer._id,
      "orderDetails.isShipped": true,
    });
    const ordersArr = [];
    for (let order of orders) {
      let orderInfo = await order.populate("productId").execPopulate();
      let marketer = await order.populate("marketerId").execPopulate();
      let commission = orderInfo.productId.marketerCommission;
      for (let detail of order.orderDetails) {
        if (detail.isShipped === true) {
          let obj = { ...detail._doc };
          obj.date = utilities.shortDate(`${order.orderDate}`);
          obj.commission = commission;
          obj.marketerName = marketer.marketerId.name;
          ordersArr.push(obj);
        }
      }
    }
    res.status(201).json({ pkgs: ordersArr });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next();
  }
};

exports.getDownloadProductImages = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    let files = [];
    let counter = 1;
    for (let path of product.imagePath) {
      let obj = {};
      obj.path = path;
      obj.name = `${Date.now()}-${counter}`;
      ++counter;
      files.push(obj);
    }
    res.zip(files);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getDownloadImage = (req, res, next) => {
  const filename = req.params.imageId;
  const filePath = path.join("images", filename);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return next(err);
    }
    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Content-Disposition", 'attach; filename="' + filename + '"');
    res.send(data);
  });
};
