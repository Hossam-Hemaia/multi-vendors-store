const express = require("express");
const marketerController = require("../controllers/marketerController");
const isAuth = require("../validations/is-auth");

const router = express.Router();

router.get(
  "/marketer/dashBoard",
  isAuth.authMarketer,
  marketerController.getDashBoard
);

router.get(
  "/copyLink/:productId",
  isAuth.authMarketer,
  marketerController.getCopyLink
);

router.delete(
  "/productPlan/:productId",
  isAuth.authMarketer,
  marketerController.deleteProductPlan
);

router.get(
  "/product/addOrder/:productId",
  isAuth.authMarketer,
  marketerController.getAddOrder
);

router.post(
  "/marketer/createOrder",
  isAuth.authMarketer,
  marketerController.postMarketerCreateOrder
);

router.get(
  "/marketer/orders",
  isAuth.authMarketer,
  marketerController.getMarketerOrders
);

router.post(
  "/marketer/order/report",
  isAuth.authMarketer,
  marketerController.postMarketerOrdersReport
);

router.get(
  "/product/imagesDownload/:productId",
  isAuth.authMarketer,
  marketerController.getDownloadProductImages
);

router.get(
  "/product/images/:imageId",
  isAuth.authMarketer,
  marketerController.getDownloadImage
);

module.exports = router;
