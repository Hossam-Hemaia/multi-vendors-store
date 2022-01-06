const express = require("express");
const bcrypt = require("bcryptjs");
const authController = require("../controllers/authController");
const isNotAuth = require("../validations/is-notAuth");
const Seller = require("../models/seller");
const Affilliate = require("../models/affilliate");
const Client = require("../models/client");
const validator = require("../validations/validation");

const router = express.Router();

router.get("/register", isNotAuth, authController.getRegister);

router.get("/register/:seller", isNotAuth, authController.getRegister);

router.post(
  "/designer-register",
  [
    validator.validateName,
    validator.validateEmail.custom(async (value, { req }) => {
      if (req.url === "/designer-register") {
        const designer = await Seller.findOne({ email: value });
        if (designer) {
          throw new Error("Email is already registered.");
        }
      }
    }),
    validator.validatePassword,
    validator.validateConfirmPassword.custom((value, { req }) => {
      if (req.url === "/designer-register") {
        if (value !== req.body.password) {
          throw new Error("passwords does not match");
        }
        return true;
      }
    }),
  ],
  authController.postSellerRegister
);

router.get(
  "/affilliate/register",
  isNotAuth,
  authController.getAffilliateRegister
);

router.post(
  "/affilliate-register",
  [
    validator.validateName,
    validator.validateEmail.custom(async (value, { req }) => {
      if (req.url === "/affilliate-register") {
        const designer = await Affilliate.findOne({ email: value });
        if (designer) {
          throw new Error("Email is already registered.");
        }
      }
    }),
    validator.validatePassword,
    validator.validateConfirmPassword.custom((value, { req }) => {
      if (req.url === "/affilliate-register") {
        if (value !== req.body.password) {
          throw new Error("passwords does not match");
        }
        return true;
      }
    }),
  ],
  authController.postAffilliateRegister
);

router.post(
  "/client-register",
  [
    validator.validateFirstName,
    validator.validateLastName,
    validator.validateEmail.custom(async (value, { req }) => {
      if (req.url === "/client-register") {
        const client = await Client.findOne({ email: value });
        if (client) {
          throw new Error("Email is already registered.");
        }
      }
    }),
    validator.validatePassword,
    validator.validateConfirmPassword.custom((value, { req }) => {
      if (req.url === "/client-register") {
        if (value !== req.body.password) {
          throw new Error("passwords does not match");
        }
        return true;
      }
    }),
  ],
  authController.postClientRegister
);

router.get("/login", isNotAuth, authController.getLogin);

router.post(
  "/designerLogin",
  [
    validator.validateEmail.custom(async (value, { req }) => {
      if (req.url === "/designerLogin") {
        let existingUser;
        if (req.body.marketer) {
          existingUser = await Affilliate.findOne({ email: value });
          req.marketer = existingUser;
        } else {
          existingUser = await Seller.findOne({ email: value });
          req.seller = existingUser;
        }
        if (!existingUser) {
          throw new Error("Email is not registered.");
        }
      }
    }),
    validator.validatePassword.custom(async (value, { req }) => {
      if (req.url === "/designerLogin") {
        if (req.body.marketer) {
          const doMatch = await bcrypt.compare(value, req.marketer.password);
          if (!doMatch) {
            throw new Error("Incorrect password");
          }
        } else {
          const doMatch = await bcrypt.compare(value, req.seller.password);
          if (!doMatch) {
            throw new Error("Incorrect password");
          }
        }
      }
    }),
  ],
  authController.postSellerLogin
);

router.post(
  "/clientLogin",
  [
    validator.validateEmail.custom(async (value, { req }) => {
      if (req.url === "/clientLogin") {
        const existeingClient = await Client.findOne({ email: value });
        if (!existeingClient) {
          throw new Error("Email is not registered.");
        }
        req.client = existeingClient;
      }
    }),
    validator.validatePassword.custom(async (value, { req }) => {
      if (req.url === "/clientLogin") {
        const doMatch = await bcrypt.compare(value, req.client.password);
        if (!doMatch) {
          throw new Error("Incorrect password");
        }
      }
    }),
  ],
  authController.postClientLogin
);

router.get("/logout", authController.getLogout);

router.get("/reset/:reseterType", authController.getReset);

router.post(
  "/reset-designer",
  [validator.validateEmail],
  authController.postReset
);

router.post(
  "/reset-client",
  [validator.validateEmail],
  authController.postReset
);

router.get("/reset/:token/:reseterType", authController.getNewPassword);

router.post("/newPassword", authController.postNewPassword);

module.exports = router;
