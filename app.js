/* eslint-disable no-unused-vars */
const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const Seller = require("./models/seller");
const Affilliate = require("./models/affilliate");
const Client = require("./models/client");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const clientRouter = require("./routes/client");
const marketerRouter = require("./routes/affilliate");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/error");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//MONGO_USER=hossam MONGO_PASSWORD=h23121980 MONGO_DATABASE=tagerStore
//mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@SG-weGoProduction-42345.servers.mongodirector.com:27017/${process.env.MONGO_DATABASE}
const MONGODB_Uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.k7ohi.mongodb.net/${process.env.MONGO_DATABASE}`;
const store = new MongoDBStore({
  uri: MONGODB_Uri,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24,
});
const csrfProtection = csrf();
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).array("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "in the name of good most greciuos most merciful",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(csrfProtection);
app.use(async (req, res, next) => {
  if (!req.session.seller) {
    return next();
  }
  try {
    const seller = await Seller.findById(req.session.seller._id);
    req.seller = seller;
    next();
  } catch (err) {
    throw new Error(err);
  }
});
app.use(async (req, res, next) => {
  if (!req.session.client) {
    return next();
  }
  try {
    const client = await Client.findById(req.session.client._id);
    req.client = client;
    next();
  } catch (err) {
    throw new Error(err);
  }
});
app.use(async (req, res, next) => {
  if (!req.session.marketer) {
    return next();
  }
  try {
    const marketer = await Affilliate.findById(req.session.marketer._id);
    req.marketer = marketer;
    next();
  } catch (err) {
    throw new Error(err);
  }
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.authenticatedClient = req.session.clientLoggedIn;
  res.locals.authenticatedMarketer = req.session.marketerLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(authRouter);
app.use(adminRouter);
app.use(clientRouter);
app.use(marketerRouter);

app.get("/", homeController.getHomeProducts);

app.use("/500", errorController.get500);
app.use(errorController.getNotFound);
app.use((error, req, res, next) => {
  console.log(error);
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_Uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    const server = app.listen(process.env.PORT || 5000, () => {
      console.log("listening on port 5000");
    });
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("client connected!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
