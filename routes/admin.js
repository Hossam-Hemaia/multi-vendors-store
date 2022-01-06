const express = require("express");
const bcrypt = require("bcryptjs");
const adminController = require("../controllers/adminController");
const isAuth = require("../validations/is-auth");
const Seller = require("../models/seller");
const validator = require("../validations/validation");

const router = express.Router();

router.get("/dashBoard", isAuth.authDesigner, adminController.getDashBoard);

router.get(
  "/designer/addDesign",
  isAuth.authDesigner,
  adminController.getAddProduct
);

router.post(
  "/designer/addDesign",
  [
    validator.validateTitle,
    validator.validtePrice,
    validator.validateDescription,
  ],
  isAuth.authDesigner,
  adminController.postAddProduct
);

router.get(
  "/designer/editDesign/:productId",
  isAuth.authDesigner,
  adminController.getEditProduct
);

router.post(
  "/designer/editDesign",
  [
    validator.validateTitle,
    validator.validtePrice,
    validator.validateDescription,
  ],
  isAuth.authDesigner,
  adminController.postEditProduct
);

router.delete(
  "/designer/:productId",
  isAuth.authDesigner,
  adminController.deleteProduct
);

router.get(
  "/designer/changePass",
  isAuth.authDesigner,
  adminController.getChangePassword
);

router.post(
  "/changePass",
  [
    validator.validateOldPassword.custom(async (value, { req }) => {
      const seller = await Seller.findOne({ _id: req.body.sellerId });
      const doMatch = await bcrypt.compare(value, seller.password);
      if (!doMatch) {
        throw new Error("Incorrect old password!");
      }
    }),
    validator.validateNewPassword,
    validator.validateConfirmNewPassword.custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("new password does not match");
      }
      return true;
    }),
  ],
  isAuth.authDesigner,
  adminController.postChangePassword
);

router.get(
  "/designer/profile",
  isAuth.authDesigner,
  adminController.getSellerProfile
);

router.post(
  "/designer/saveChanges",
  [validator.validateName, validator.validateAge],
  isAuth.authDesigner,
  adminController.postSellerProfile
);

router.get(
  "/seller/totalEarnings",
  isAuth.authDesigner,
  adminController.getTotalEarnings
);

router.post(
  "/seller/earnings",
  isAuth.authDesigner,
  adminController.postTotalEarnings
);

router.get(
  "/seller/withdraw",
  isAuth.authDesigner,
  adminController.getWithdraw
);

router.post(
  "/seller/withdrawBalance",
  [
    validator.validateWithdraw.custom(async (value, { req }) => {
      if (value > req.seller.balance || value < 100) {
        throw new Error("insufficient balance");
      }
    }),
  ],
  isAuth.authDesigner,
  adminController.postWithdrawBalance
);

router.get(
  "/system/admin/create",
  isAuth.authDesigner,
  adminController.getSystemAdminCreate
);

router.post(
  "/new/admin/create",
  [
    validator.validateEmail,
    validator.validatePassword,
    validator.validateConfirmPassword.custom((value, { req }) => {
      if (req.url === "/new/admin/create") {
        if (value !== req.body.password) {
          throw new Error("passwords does not match");
        } else {
          return true;
        }
      }
    }),
  ],
  isAuth.authDesigner,
  adminController.postSystemAdminCreate
);

router.get(
  "/sellers/requests",
  isAuth.authDesigner,
  adminController.getSellersRequests
);

router.get(
  "/seller/approve/:sellerId",
  isAuth.authDesigner,
  adminController.getSellersApprove
);

router.get(
  "/marketer/approve/:marketerId",
  isAuth.authDesigner,
  adminController.getMarketersApprove
);

router.post(
  "/seller/confirm/approve",
  isAuth.authDesigner,
  adminController.postSellerApprove
);

router.post(
  "/marketer/confirm/approve",
  isAuth.authDesigner,
  adminController.postMarketerApprove
);

router.get(
  "/shipping/requests",
  isAuth.authDesigner,
  adminController.getShippingRequests
);

router.post(
  "/shipping/report",
  isAuth.authDesigner,
  adminController.postShippingReport
);

router.post(
  "/sales/report",
  isAuth.authDesigner,
  adminController.postSalesReport
);

router.post(
  "/shipping/state",
  isAuth.authDesigner,
  adminController.postShippingState
);

router.post(
  "/reject/state",
  isAuth.authDesigner,
  adminController.postRejectState
);

router.get(
  "/categories/monitor",
  isAuth.authDesigner,
  adminController.getCategoriesMonitor
);

router.get(
  "/seller/remove",
  isAuth.authDesigner,
  adminController.getRemoveSeller
);

router.post(
  "/seller/remove",
  isAuth.authDesigner,
  adminController.postRemoveSeller
);

router.get(
  "/products/categories",
  isAuth.authDesigner,
  adminController.getAddModifyCategories
);

router.post(
  "/add/category",
  isAuth.authDesigner,
  adminController.postAddCategory
);

router.post(
  "/modify/category",
  isAuth.authDesigner,
  adminController.postModifyCategory
);

router.get(
  "/addModify/shippingFees",
  isAuth.authDesigner,
  adminController.getAddModifyShippingFees
);

router.post(
  "/region/add/fee",
  isAuth.authDesigner,
  adminController.postAddRegionFee
);

router.get(
  "/marketer/orders",
  isAuth.authDesigner,
  adminController.getMarketerOrders
);

router.post(
  "/marketer/order/report",
  isAuth.authDesigner,
  adminController.postMarketerOrdersReport
);

router.get(
  "/marketers/report",
  isAuth.authDesigner,
  adminController.getMarketersReport
);

module.exports = router;
