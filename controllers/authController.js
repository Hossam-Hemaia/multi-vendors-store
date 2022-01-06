const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const { validationResult } = require("express-validator");
const Seller = require("../models/seller");
const Product = require("../models/product");
const Client = require("../models/client");
const Affilliate = require("../models/affilliate");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "hoseamhemaea80@gmail.com",
    pass: "h@23121980",
  },
});
//register page route
exports.getRegister = (req, res, next) => {
  const registererType = +req.params.seller;
  if (registererType === 2) {
    try {
      return res.status(200).render("auth/register", {
        pageTitle: "Register",
        hasError: false,
        isDesigner: true,
        isClient: false,
        oldInput: {
          oldFirstName: "",
          oldLastName: "",
          oldName: "",
          oldCountry: "",
          oldCity: "",
          oldAge: "",
          oldGender: "",
          oldEmail: "",
          oldPassword: "",
        },
      });
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  }
  try {
    res.status(200).render("auth/register", {
      pageTitle: "Register",
      hasError: false,
      isDesigner: false,
      isClient: false,
      oldInput: {
        oldFirstName: "",
        oldLastName: "",
        oldName: "",
        oldCountry: "",
        oldCity: "",
        oldAge: "",
        oldGender: "",
        oldEmail: "",
        oldPassword: "",
      },
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

//registering new designer to database
exports.postSellerRegister = async (req, res, next) => {
  const { name, region, phoneNumber, address, wegoShipping, email, password } =
    req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty() && errors.array()[0].msg !== "Invalid value") {
    return res.status(422).render("auth/register", {
      pageTitle: "Register",
      hasError: true,
      isDesigner: true,
      isClient: false,
      oldInput: {
        oldName: name,
        oldRegion: region,
        oldPhone: phoneNumber,
        oldAddress: address,
        oldShipping: wegoShipping,
        oldEmail: email,
        oldPassword: password,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const seller = new Seller({
      name,
      phoneNumber,
      region,
      address,
      wegoShipping,
      email,
      password: hashedPassword,
    });
    await seller.save();
    req.session.isLoggedIn = true;
    req.session.seller = seller;
    res.status(200).render("admin/dashBoard", {
      pageTitle: "Dash Board",
      sellerId: seller._id,
      sellerName: seller.name,
      approved: seller.isApproved,
      products: [],
    });
    transporter.sendMail(
      {
        to: email,
        from: "soqna@soqna.com",
        subject: "Congratulations! You Successfully Registered",
        html: `<h1>Lets Start Working</h1>
        <p>نشكركم على تسجيلكم معنا فى بدايه برجاء انتظار الموافقه على طلبكم فى اقرب وقت</p>`,
      },
      (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email-Sent to: " + info.response);
        }
      }
    );
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getAffilliateRegister = (req, res, next) => {
  try {
    res.status(200).render("auth/affRegister", {
      pageTitle: "Register",
      hasError: false,
      isDesigner: false,
      oldInput: {
        oldName: "",
        oldCountry: "",
        oldCity: "",
        oldAge: "",
        oldGender: "",
        oldEmail: "",
        oldPassword: "",
      },
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postAffilliateRegister = async (req, res, next) => {
  const { name, region, phoneNumber, address, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty() && errors.array()[0].msg !== "Invalid value") {
    return res.status(422).render("auth/affRegister", {
      pageTitle: "Register",
      hasError: true,
      isDesigner: true,
      oldInput: {
        oldName: name,
        oldRegion: region,
        oldPhone: phoneNumber,
        oldAddress: address,
        oldEmail: email,
        oldPassword: password,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const marketer = new Affilliate({
      name,
      phoneNumber,
      region,
      address,
      email,
      password: hashedPassword,
    });
    await marketer.save();
    req.session.marketerLoggedIn = true;
    req.session.marketer = marketer;
    res.status(200).render("admin/marketerDashBoard", {
      pageTitle: "Dash Board",
      marketerId: marketer._id,
      products: [],
      marketerName: marketer.name,
    });
    transporter.sendMail(
      {
        to: email,
        from: "soqna@soqna.com",
        subject: "Congratulations! You Successfully Registered",
        html: `<h1>Lets Start Working</h1>
      <p>نشكركم على تسجيلكم معنا فى بدايه يمكنك الان البدء فى تسويق اى منتج من اختيارك والحصول على عمولتك</p>`,
      },
      (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email-Sent to: " + info.response);
        }
      }
    );
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
//registering a new client
exports.postClientRegister = async (req, res, next) => {
  const { firstName, lastName, region, phoneNumber, address, email, password } =
    req.body;
  const name = firstName + " " + lastName;
  const errors = validationResult(req);
  if (!errors.isEmpty() && errors.array()[0].msg !== "Invalid value") {
    return res.status(422).render("auth/register", {
      pageTitle: "Register",
      hasError: true,
      isDesigner: false,
      isClient: true,
      oldInput: {
        oldFirstName: firstName,
        oldLastName: lastName,
        oldEmail: email,
        oldPassword: password,
        oldRegion: region,
        oldPhone: phoneNumber,
        oldAddress: address,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  try {
    const clientHashedPass = await bcrypt.hash(password, 12);
    const client = new Client({
      name,
      phoneNumber,
      address,
      region,
      email,
      password: clientHashedPass,
    });
    await client.save();
    req.session.clientLoggedIn = true;
    req.session.client = client;
    req.session.itemsPerPage = 0;
    req.session.cartCounter = 0;
    req.session.isRating = 0;
    res.redirect("/market/all");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
//login page function for both client and designer
exports.getLogin = (req, res, next) => {
  try {
    res.status(200).render("auth/login", {
      pageTitle: "Login",
      hasError: false,
      isDesigner: false,
      isClient: false,
      oldInput: {
        oldEmail: "",
        oldPassword: "",
      },
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
//designer login function
exports.postSellerLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty() && errors.array()[0].msg !== "Invalid value") {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      hasError: true,
      isDesigner: true,
      isClient: false,
      oldInput: {
        oldEmail: email,
        oldPassword: password,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  let seller;
  let marketer;
  if (req.seller) {
    seller = req.seller;
    req.session.seller = seller;
    req.session.isLoggedIn = true;
  } else {
    marketer = req.marketer;
    req.session.marketer = marketer;
    req.session.marketerLoggedIn = true;
  }
  try {
    if (seller && req.seller.privilege === "admin") {
      const adminProducts = await Product.find({ shippingByweGo: true });
      res.status(201).render("admin/adminDashBoard", {
        pageTitle: "Dash Board",
        isAuthenticated: req.session.isLoggedIn,
        products: adminProducts || [],
        sellerName: seller.name,
        sellerId: seller._id,
        approved: seller.isApproved,
      });
    } else if (marketer) {
      // const products = [];
      // for (let productId of req.marketer.products) {
      //   let product = await Product.findById(productId);
      //   products.push(product);
      // }
      // res.status(200).render("admin/marketerDashBoard", {
      //   pageTitle: "Dash Board",
      //   marketerId: req.marketer._id,
      //   products: products || [],
      //   marketerName: req.marketer.name,
      // });
      res.redirect("/marketer/dashBoard");
    } else {
      const products = await Product.find({ sellerId: seller._id });
      res.status(201).render("admin/dashBoard", {
        pageTitle: "Dash Board",
        isAuthenticated: req.session.isLoggedIn,
        products: products,
        sellerName: seller.name,
        sellerId: seller._id,
        approved: seller.isApproved,
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
//client login function
exports.postClientLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      hasError: true,
      isClient: true,
      isDesigner: false,
      oldInput: {
        oldEmail: email,
        oldPassword: password,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  try {
    const client = req.client;
    req.session.client = client;
    req.session.clientLoggedIn = true;
    req.session.cartCounter = 0;
    req.session.itemsPerPage = 0;
    req.session.isRating = 0;
    res.redirect("/market/all");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
//logout function for both designer and client
exports.getLogout = async (req, res, next) => {
  if (req.session.client) {
    req.session.cartCounter = 0;
    await req.client.clearCart();
  }
  await req.session.destroy((err) => {
    if (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
    res.redirect("/");
  });
};
//reset page function
exports.getReset = (req, res, next) => {
  const reseterType = req.params.reseterType;
  try {
    if (reseterType === "1") {
      res.status(200).render("auth/resetPass", {
        pageTitle: "Reset Password",
        resetType: "client",
      });
    } else {
      res.status(200).render("auth/resetPass", {
        pageTitle: "Reset Password",
        resetType: "designer",
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postReset = async (req, res, next) => {
  const email = req.body.email;
  const reseterType = req.body.reseterType;
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpirationDate = Date.now() + 3600000;
  try {
    if (reseterType === "designer") {
      const seller = await Seller.findOne({ email: email });
      if (!seller) {
        return res.redirect("/reset/2");
      }
      seller.resetToken = token;
      seller.resetTokenExpirationDate = tokenExpirationDate;
      await seller.save();
    } else if (reseterType === "client") {
      const client = await Client.findOne({ email: email });
      if (!client) {
        return res.redirect("/reset/1");
      }
      client.resetToken = token;
      client.resetTokenExpirationDate = tokenExpirationDate;
      await client.save();
    }
    transporter.sendMail({
      to: email,
      from: "teepodTeam@teepod.com",
      subject: "Password Reset",
      html: `
      <p>You have required to reset your passowrd please follow the link below</p>
      <p>click this <a href="http://localhost:3000/reset/${token}/${reseterType}">link</a> to reset your password</p>
      <p>best regards</p>
      `,
    });
    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  const reseterType = req.params.reseterType;
  try {
    let reseterId = "";
    if (reseterType === "designer") {
      const seller = await Seller.findOne({
        resetToken: token,
        resetTokenExpirationDate: { $gt: Date.now() },
      });
      if (!seller) {
        return res.redirect("/reset/2");
      }
      reseterId = seller._id.toString();
    } else if (reseterType === "client") {
      const client = await Client.findOne({
        resetToken: token,
        resetTokenExpirationDate: { $gt: Date.now() },
      });
      if (!client) {
        return res.redirect("/reset/1");
      }
      reseterId = client._id.toString();
    }
    res.status(200).render("auth/newPassword", {
      pageTitle: "New Password Reset",
      token: token,
      reseterId: reseterId,
      reseterType: reseterType,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const { newPassword, confirmNewPassword, token, reseterId, reseterType } =
    req.body;
  if (newPassword !== confirmNewPassword) {
    return res.redirect(`/reset/${token}/${reseterType}`);
  }
  try {
    if (reseterType === "designer") {
      const seller = await Seller.findOne({
        resetToken: token,
        resetTokenExpirationDate: { $gt: Date.now() },
        _id: reseterId,
      });
      if (!seller) {
        return res.redirect("/reset/2");
      }
      const newHashedPass = await bcrypt.hash(newPassword, 12);
      seller.password = newHashedPass;
      seller.resetToken = "";
      seller.resetTokenExpirationDate = undefined;
      await seller.save();
    } else if (reseterType === "client") {
      const client = await Client.findOne({
        resetToken: token,
        resetTokenExpirationDate: { $gt: Date.now() },
        _id: reseterId,
      });
      if (!client) {
        return res.redirect("/reset/1");
      }
      const newHashedPass = await bcrypt.hash(newPassword, 12);
      client.password = newHashedPass;
      client.token = "";
      client.resetTokenExpirationDate = undefined;
      await client.save();
    }
    res.redirect("/login");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
