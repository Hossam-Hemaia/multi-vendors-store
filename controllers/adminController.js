const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const Product = require("../models/product");
const Seller = require("../models/seller");
const Affilliate = require("../models/affilliate");
const Orders = require("../models/orders");
const AffOrders = require("../models/affOrders");
const Categories = require("../models/categories");
const ShippingFees = require("../models/shippingFees");
const utilities = require("../utils/utilities");

exports.getDashBoard = async (req, res, next) => {
  try {
    let sellerType = await Seller.findById(req.seller._id);
    const products = await Product.find({ sellerId: req.seller._id });
    if (sellerType.privilege === "admin") {
      const adminProducts = await Product.find({});
      res.status(201).render("admin/adminDashBoard", {
        pageTitle: "Dash Board",
        products: adminProducts || [],
        isAuthenticated: req.session.isLoggedIn,
        sellerId: req.seller._id,
        sellerName: req.seller.name,
        approved: req.seller.isApproved,
      });
    } else {
      res.status(201).render("admin/dashBoard", {
        pageTitle: "Dash Board",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
        sellerId: req.seller._id,
        sellerName: req.seller.name,
        approved: req.seller.isApproved,
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getAddProduct = async (req, res, next) => {
  try {
    const categories = await Categories.find({});
    res.status(200).render("admin/addDesign", {
      pageTitle: "Upload Product",
      hasError: false,
      seller: req.seller,
      categories,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postAddProduct = async (req, res, next) => {
  let showImages = [];
  const {
    title,
    price,
    shippingFees,
    marketerCommission,
    stock,
    colors,
    sizes,
    description,
    details,
    category,
  } = req.body;
  let productColors = [];
  let productSizes = [];
  if (!Array.isArray(colors)) {
    productColors.push(colors);
  } else {
    productColors = [...colors];
  }
  if (!Array.isArray(sizes)) {
    productSizes.push(sizes);
  } else {
    productSizes = [...sizes];
  }
  let isPublished = true;
  const images = req.files;
  if (!images) {
    const categories = await Categories.find({});
    return res.status(422).render("admin/addDesign", {
      pageTitle: "Upload Product",
      hasError: true,
      product: {
        title,
        price,
        shippingFees,
        marketerCommission,
        stock,
        category,
        description,
        details,
      },
      seller: req.seller,
      categories,
      errorMessage: "Uploaded files are not an image or no images uploaded!",
      validationError: [],
    });
  }
  try {
    for (let image of images) {
      let showImage = sharp(image.path)
        .resize(1200, 800, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0.5 },
        })
        .webp({ quality: 90 })
        .toFile(`./images/${image.filename}.webp`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      showImages.push(showImage.options.fileOut);
    }
  } catch (err) {
    console.log(err);
    res.status(500).redirect("/dashBoard");
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const categories = await Categories.find({});
    return res.status(422).render("admin/addDesign", {
      pageTitle: "Upload Product",
      hasError: true,
      product: {
        title,
        price,
        shippingFees,
        marketerCommission,
        stock,
        category,
        description,
        details,
      },
      seller: req.seller,
      categories,
      errorMessage: errors.array()[0].msg,
      validationError: errors.array(),
    });
  }
  let isMonitor;
  if (req.seller.wegoShipping === true && req.seller.privilege === "user") {
    isMonitor = true;
  } else {
    isMonitor = false;
  }
  let shippingByweGo = req.seller.privilege === "admin" ? true : false;
  const product = new Product({
    title,
    price,
    shippingFees,
    marketerCommission,
    stock,
    colors: productColors,
    sizes: productSizes,
    imagePath: showImages,
    category,
    description,
    details,
    sellerId: req.seller,
    sellerName: req.seller.name,
    published: isPublished,
    monitor: isMonitor,
    shippingByweGo,
  });
  try {
    await product.save();
    for (let image of images) {
      utilities.deleteFile(image.path);
    }
    res.status(200).redirect("/dashBoard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    const categories = await Categories.find({});
    res.status(200).render("admin/editDesign", {
      pageTitle: "Edit Product",
      hasError: false,
      product: product,
      seller: req.seller,
      errorMessage: "",
      validationError: [],
      categories,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  let showImages = [];
  const {
    title,
    price,
    shippingFees,
    marketerCommission,
    stock,
    colors,
    sizes,
    category,
    description,
    details,
    productId,
  } = req.body;
  let productColors = [];
  let productSizes = [];
  if (!Array.isArray(colors) && colors !== "") {
    productColors.push(colors);
  } else {
    productColors = [...colors];
  }
  if (!Array.isArray(sizes) && sizes !== "") {
    productSizes.push(sizes);
  } else {
    productSizes = [...sizes];
  }
  const product = await Product.findById(productId);
  if (
    product.sellerId.toString() !== req.seller._id.toString() &&
    req.seller.privilege !== "admin"
  ) {
    return res.status(500).render("home");
  }
  const images = req.files;
  if (images.length > 0) {
    for (let path of product.imagePath) {
      utilities.deleteFile(path);
    }
    try {
      for (let image of images) {
        let showImage = sharp(image.path)
          .resize(1200, 800, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 0.5 },
          })
          .webp({ quality: 90 })
          .toFile(`./images/${image.filename}.webp`, (err) => {
            if (err) {
              console.log(err);
            }
          });
        showImages.push(showImage.options.fileOut);
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const categories = await Categories.find({});
        return res.status(422).render("admin/editDesign", {
          pageTitle: "Upload Product",
          hasError: true,
          product: {
            title,
            price,
            shippingFees,
            marketerCommission,
            stock,
            category,
            description,
            details,
            _id: productId,
          },
          seller: req.seller,
          categories,
          errorMessage: errors.array()[0].msg,
          validationError: errors.array(),
        });
      }

      product.title = title;
      product.price = price;
      product.shippingFees = shippingFees;
      product.marketerCommission = marketerCommission;
      product.stock = stock;
      product.colors =
        productColors.length > 0 ? productColors : product.colors;
      product.sizes = productSizes.length > 0 ? productSizes : product.sizes;
      product.imagePath = showImages;
      product.category = category;
      product.description = description;
      product.details = details;
      await product.save();
      res.status(201).redirect("/dashBoard");
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  } else {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await Categories.find({});
      return res.status(422).render("admin/editDesign", {
        pageTitle: "Upload Product",
        hasError: true,
        product: {
          title,
          price,
          shippingFees,
          marketerCommission,
          stock,
          category,
          description,
          details,
          _id: productId,
        },
        seller: req.seller,
        categories,
        errorMessage: errors.array()[0].msg,
        validationError: errors.array(),
      });
    }
    try {
      console.log(product.colors, product.sizes);
      product.title = title;
      product.price = price;
      product.shippingFees = shippingFees;
      product.marketerCommission = marketerCommission;
      product.stock = stock;
      if (productColors.length > 0) {
        product.colors = productColors;
      }
      if (productSizes.length > 0) {
        product.sizes = productSizes;
      }
      product.category = category;
      product.description = description;
      product.details = details;
      if (req.seller.privilege === "admin") {
        product.monitor = false;
        product.shippingByweGo = true;
      }
      await product.save();
      res.status(201).redirect("/dashBoard");
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    for (let path of product.imagePath) {
      utilities.deleteFile(path);
    }
    if (req.seller.privilege === "admin") {
      await Product.deleteOne({ _id: productId });
    } else {
      await Product.deleteOne({ _id: productId, sellerId: req.seller._id });
    }
    res.status(200).json({ message: "Success!" });
  } catch (err) {
    console.log(err);
    res.status(422).json({ message: "Faild to delete design" });
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getChangePassword = (req, res, next) => {
  const sellerId = req.seller._id;
  try {
    res.status(200).render("auth/changePassword", {
      pageTitle: "Change Password",
      sellerId: sellerId,
      hasError: false,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postChangePassword = async (req, res, next) => {
  const { newPassword, sellerId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/changePassword", {
      pageTitle: "Change Password",
      sellerId: sellerId,
      hasError: true,
      errorMessage: errors.array()[0].msg,
    });
  }
  try {
    const seller = req.seller;
    const currentHashedPassword = await bcrypt.hash(newPassword, 12);
    seller.password = currentHashedPassword;
    await seller.save();
    res.redirect("/dashBoard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getSellerProfile = async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.seller._id);
    res.status(201).render("admin/profile", {
      pageTitle: "Seller Profile",
      seller,
      hasError: false,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postSellerProfile = async (req, res, next) => {
  const { name, country, city, age, gender, sellerId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/profile", {
      pageTitle: "Seller Profile",
      seller: req.seller,
      hasError: true,
      errorMessage: errors.array()[0].msg,
    });
  }
  try {
    const seller = await Seller.findById(sellerId);
    seller.name = name;
    seller.country = country;
    seller.city = city;
    seller.age = age;
    seller.gender = gender;
    await seller.save();
    res.redirect("/dashBoard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getTotalEarnings = async (req, res, next) => {
  try {
    res.status(201).render("admin/earnings", {
      pageTitle: "تقرير المبيعات",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postTotalEarnings = async (req, res, next) => {
  const { dateFrom, dateTo } = req.body;
  try {
    const isoDateFrom = utilities.toIsoDate(dateFrom, "start");
    const isoDateTo = utilities.toIsoDate(dateTo, "");
    const orders = await Orders.find({
      orderDate: { $gte: isoDateFrom, $lte: isoDateTo },
      "products.productId.sellerId": req.seller._id,
    });
    let earningsArr = [];
    for (let order of orders) {
      let orderDetails = await order.populate("client.clientId").execPopulate();
      for (let p of order.products) {
        if (p.productId.sellerId.toString() === req.seller._id.toString()) {
          let orderInfo = {};
          orderInfo.clientName = orderDetails.client.clientId.name;
          orderInfo.clientNumber = orderDetails.client.clientId.phoneNumber;
          orderInfo.isShipped = p.isShipped;
          orderInfo.date = utilities.shortDate(`${orderDetails.orderDate}`);
          orderInfo.productTitle = p.productId.title;
          orderInfo.quantity = p.quantity;
          orderInfo.price = p.productId.price;
          earningsArr.push(orderInfo);
        }
      }
    }
    res.status(201).json({ earnings: earningsArr });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getWithdraw = async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.seller._id);
    if (!seller) {
      throw new Error("something went wrong!");
    }
    let currentBalance = seller.balance;
    let withdrawHistory = seller.withdrawHistory;
    res.status(201).render("admin/withdraw", {
      pageTitle: "سحب الرصيد",
      balance: currentBalance,
      transactions: withdrawHistory,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postWithdrawBalance = async (req, res, next) => {
  const amount = req.body.amount;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
      });
    }
    if (amount <= req.seller.balance && amount >= 100) {
      await Seller.updateOne(
        { _id: req.seller._id },
        { $inc: { balance: -amount } }
      );
      await req.seller.updateWithdrawHistory(amount);
      const withdrawTransactinos = req.seller.withdrawHistory;
      res.status(201).json({ transactions: withdrawTransactinos });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getSystemAdminCreate = (req, res, next) => {
  try {
    res.status(201).render("admin/addSysAdmin", {
      pageTitle: "اضافة مدير للنظام",
      hasError: false,
      oldInputs: {
        oldName: "",
        oldPhone: "",
        oldAddress: "",
        oldEmail: "",
        oldPassword: "",
      },
      errorMessage: [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postSystemAdminCreate = async (req, res, next) => {
  const { name, phoneNumber, address, email, password } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty() && errors.array()[0].msg !== "Invalid value") {
      console.log(errors);
      res.status(422).render("admin/addSysAdmin", {
        pageTitle: "اضافة مدير للنظام",
        hasError: true,
        oldInputs: {
          oldName: name,
          oldPhone: phoneNumber,
          oldAddress: address,
          oldEmail: email,
          oldPassword: password,
        },
        errorMessage: errors.array()[0].msg,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Seller({
      name,
      phoneNumber,
      address,
      email,
      password: hashedPassword,
      isApproved: true,
      privilege: "admin",
      wegoShipping: true,
    });
    await newAdmin.save();
    res.redirect("/dashBoard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getSellersRequests = async (req, res, next) => {
  try {
    const newSellers = await Seller.find({ isApproved: false });
    const newMarketers = await Affilliate.find({ isCommissioned: false });
    res.status(201).render("admin/sellersRequests", {
      pageTitle: "طلبات تسجيل بائعين",
      sellers: newSellers || [],
      marketers: newMarketers || [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getSellersApprove = async (req, res, next) => {
  const sellerId = req.params.sellerId;
  try {
    const seller = await Seller.findById(sellerId);
    res.status(201).render("admin/profile", {
      pageTitle: "اعتماد بائع",
      seller: seller,
      hasError: false,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getMarketersApprove = async (req, res, next) => {
  const marketerId = req.params.marketerId;
  try {
    const marketer = await Affilliate.findById(marketerId);
    res.status(201).render("admin/marketerProfile", {
      pageTitle: "اعتماد عمولة مسوق",
      marketer: marketer,
      hasError: false,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postSellerApprove = async (req, res, next) => {
  const { sellerId, commission, wegoShipping } = req.body;
  try {
    const seller = await Seller.findById(sellerId);
    seller.commissionRate = commission;
    seller.wegoShipping = wegoShipping;
    seller.isApproved = true;
    await seller.save();
    res.status(300).redirect("/dashBoard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postMarketerApprove = async (req, res, next) => {
  const { marketerId, commission } = req.body;
  try {
    const marketer = await Affilliate.findById(marketerId);
    marketer.commission = commission;
    marketer.isCommissioned = true;
    await marketer.save();
    res.status(300).redirect("/dashBoard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getShippingRequests = (req, res, next) => {
  try {
    res.status(200).render("admin/shippingRequests", {
      pageTitle: "تقرير المبيعات/طلبات الشحن",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postShippingReport = async (req, res, next) => {
  const { dateFrom, dateTo } = req.body;
  try {
    const isoDateFrom = utilities.toIsoDate(dateFrom, "start");
    const isoDateTo = utilities.toIsoDate(dateTo, "");
    const orders = await Orders.find({
      orderDate: { $gte: isoDateFrom, $lte: isoDateTo },
      "products.isWego": true,
      "products.isShipped": false,
    });
    let shippingArr = [];
    for (let order of orders) {
      let orderDetails = await order.populate("client.clientId").execPopulate();
      for (let p of order.products) {
        if (p.isWego === true && p.isShipped === false) {
          let orderInfo = {};
          let seller = await Seller.findById(p.productId.sellerId);
          orderInfo.clientName = orderDetails.client.clientId.name;
          orderInfo.clientNumber = orderDetails.client.clientId.phoneNumber;
          orderInfo.region = orderDetails.client.clientId.region;
          orderInfo.address = orderDetails.client.clientId.address;
          orderInfo.isShipped = p.isShipped;
          orderInfo.date = utilities.shortDate(`${orderDetails.orderDate}`);
          orderInfo.productId = p.productId._id;
          orderInfo.productTitle = p.productId.title;
          let descriptionArr = [];
          for (let attrib of p.attributes) {
            let qty = attrib.quantity.toString();
            let size = " مقاس " + attrib.size;
            let color = " لون " + attrib.color;
            let productAttributes = qty.concat(size, color);
            descriptionArr.push(productAttributes);
          }
          orderInfo.productDescription = descriptionArr.join(" - ");
          orderInfo.quantity = p.quantity;
          orderInfo.price = p.productId.price;
          orderInfo.shippingFees = p.productId.shippingFees;
          orderInfo.value = p.quantity * p.productId.price;
          if (!seller) {
            orderInfo.sellerName = "البائع محذوف";
          } else {
            orderInfo.sellerName = seller.name;
          }
          orderInfo.id = p._id;
          shippingArr.push(orderInfo);
        }
      }
    }
    const marketerOrders = await AffOrders.find({
      orderDate: { $gte: isoDateFrom, $lte: isoDateTo },
      "orderDetails.isShipped": false,
    });
    for (let order of marketerOrders) {
      let orderInfo = await order.populate("marketerId").execPopulate();
      let productDetails = await order.populate("productId").execPopulate();
      let marketerName = orderInfo.marketerId.name;
      for (let detail of order.orderDetails) {
        if (detail.isShipped === false) {
          let obj = { ...detail._doc };
          obj.date = utilities.shortDate(`${order.orderDate}`);
          obj.shippingFees = productDetails.productId.shippingFees;
          obj.id = obj._id;
          obj.productId = productDetails.productId._id;
          obj.marketerName = marketerName;
          shippingArr.push(obj);
        }
      }
    }
    res.status(201).json({ shippings: shippingArr });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postSalesReport = async (req, res, next) => {
  const { dateFrom, dateTo } = req.body;
  try {
    const isoDateFrom = utilities.toIsoDate(dateFrom, "start");
    const isoDateTo = utilities.toIsoDate(dateTo, "");
    const orders = await Orders.find({
      orderDate: { $gte: isoDateFrom, $lte: isoDateTo },
    });
    let shippingArr = [];
    for (let order of orders) {
      let orderDetails = await order.populate("client.clientId").execPopulate();
      for (let p of order.products) {
        let orderInfo = {};
        let seller = await Seller.findById(p.productId.sellerId);
        if (
          p.isWego === true &&
          p.isShipped === true &&
          p.isDelivered === true
        ) {
          orderInfo.clientName = orderDetails.client.clientId.name;
          orderInfo.clientNumber = orderDetails.client.clientId.phoneNumber;
          orderInfo.address = orderDetails.client.clientId.address;
          orderInfo.date = utilities.shortDate(`${orderDetails.orderDate}`);
          orderInfo.productTitle = p.productId.title;
          orderInfo.quantity = p.quantity;
          orderInfo.price = p.productId.price;
          orderInfo.shippingFees = p.productId.shippingFees;
          orderInfo.productId = p.productId._id;
          if (!seller) {
            orderInfo.sellerName = "البائع محذوف";
            orderInfo.commission = "البائع محذوف";
          } else {
            orderInfo.sellerName = seller.name;
            orderInfo.commission = seller.commissionRate;
          }
          shippingArr.push(orderInfo);
        } else if (p.isWego === false) {
          orderInfo.clientName = orderDetails.client.clientId.name;
          orderInfo.clientNumber = orderDetails.client.clientId.phoneNumber;
          orderInfo.address = orderDetails.client.clientId.address;
          orderInfo.date = utilities.shortDate(`${orderDetails.orderDate}`);
          orderInfo.productTitle = p.productId.title;
          orderInfo.quantity = p.quantity;
          orderInfo.price = p.productId.price;
          orderInfo.productId = p.productId._id;
          orderInfo.shippingFees = 0;
          if (!seller) {
            orderInfo.sellerName = "البائع محذوف";
            orderInfo.commission = "البائع محذوف";
          } else {
            orderInfo.sellerName = seller.name;
            orderInfo.commission = seller.commissionRate;
          }
          shippingArr.push(orderInfo);
        }
      }
    }
    const marketerOrders = await AffOrders.find({
      orderDate: { $gte: isoDateFrom, $lte: isoDateTo },
      "orderDetails.isShipped": true,
    });
    for (let order of marketerOrders) {
      let orderInfo = await order.populate("marketerId").execPopulate();
      let productDetails = await order.populate("productId").execPopulate();
      let seller = await Seller.findById(productDetails.productId.sellerId);
      let marketerName = orderInfo.marketerId.name;
      for (let detail of order.orderDetails) {
        if (detail.isShipped === true && detail.isDelivered === true) {
          let obj = { ...detail._doc };
          obj.date = utilities.shortDate(`${order.orderDate}`);
          obj.shippingFees = productDetails.productId.shippingFees;
          obj.marketerName = marketerName;
          obj.commission = seller.commissionRate;
          obj.marketerCommission = productDetails.productId.marketerCommission;
          obj.productId = productDetails.productId._id;
          shippingArr.push(obj);
        }
      }
    }
    res.status(201).json({ sales: shippingArr });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postShippingState = async (req, res, next) => {
  const productId = req.body.soldProductId;
  console.log(productId);
  try {
    await Orders.updateOne(
      { "products._id": productId },
      { $set: { "products.$.isShipped": true, "products.$.isDelivered": true } }
    );
    await AffOrders.updateOne(
      { "orderDetails._id": productId },
      {
        $set: {
          "orderDetails.$.isShipped": true,
          "orderDetails.$.isDelivered": true,
        },
      }
    );
    res.status(201).json({ message: "changed" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postRejectState = async (req, res, next) => {
  const productId = req.body.soldProductId;
  try {
    await Orders.updateOne(
      { "products._id": productId },
      {
        $set: { "products.$.isShipped": true, "products.$.isDelivered": false },
      }
    );
    await AffOrders.updateOne(
      { "orderDetails._id": productId },
      {
        $set: {
          "orderDetails.$.isShipped": true,
          "orderDetails.$.isDelivered": false,
        },
      }
    );
    res.status(201).json({ message: "changed" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getCategoriesMonitor = async (req, res, next) => {
  try {
    const products = await Product.find({ monitor: true });
    const productsDetails = [];
    for (let product of products) {
      let productDetails = await product.populate("sellerId").execPopulate();
      productsDetails.push(productDetails);
    }
    res.status(201).render("admin/categories", {
      pageTitle: "مراقبة الاصناف",
      products: productsDetails || [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getRemoveSeller = async (req, res, next) => {
  try {
    const sellers = await Seller.find({});
    res.status(200).render("admin/removeSeller", {
      pageTitle: "حذف بائع",
      sellers: sellers,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postRemoveSeller = async (req, res, next) => {
  const sellerId = req.body.sellerId;
  try {
    await Seller.updateOne({ _id: sellerId }, { $set: { isApproved: false } });
    res.status(300).redirect("/dashBoard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getAddModifyCategories = async (req, res, next) => {
  try {
    const categories = await Categories.find({});
    res.status(200).render("admin/productCategory", {
      pageTitle: "اضافة/تعديل الفئات",
      categories,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postAddCategory = async (req, res, next) => {
  const { categoryName, catEnglishName } = req.body;
  try {
    let englishCategory = catEnglishName.split(" ").join("");
    const category = new Categories({
      categoryName: categoryName,
      catEnglishName: englishCategory,
    });
    await category.save();
    res.status(201).json({ message: "success" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postModifyCategory = async (req, res, next) => {
  const { selectedCategory, categoryName, catEnglishName } = req.body;
  try {
    await Categories.updateOne(
      { catEnglishName: selectedCategory },
      { $set: { categoryName: categoryName, catEnglishName: catEnglishName } }
    );
    res.status(201).json({ message: "success" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getAddModifyShippingFees = (req, res, next) => {
  try {
    res.render("admin/shippingFees", { pageTitle: "اضافة تعديل اسعار الشحن" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postAddRegionFee = async (req, res, next) => {
  const { region, shippingFee } = req.body;
  try {
    let shippingRegion = await ShippingFees.findOne({ region: region });
    if (shippingRegion) {
      shippingRegion.fee = shippingFee;
      await shippingRegion.save();
      res.status(201).redirect("/dashBoard");
    } else {
      shippingRegion = new ShippingFees({
        region: region,
        fee: shippingFee,
      });
      await shippingRegion.save();
      res.status(201).redirect("/dashBoard");
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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

exports.getMarketersReport = async (req, res, next) => {
  try {
    const marketers = await Affilliate.find({});
    res.render("admin/marketersReport", {
      pageTitle: "تقرير بيانات المسوقين",
      marketers: marketers || [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next();
  }
};
