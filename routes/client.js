const express = require("express");
const clientController = require("../controllers/clientController");
const isAuth = require("../validations/is-auth");

const router = express.Router();

router.get("/market/:productType", clientController.getMarket);

router.get("/market/all/:itemPerPage", clientController.getMarket);

router.get("/category/:productType", clientController.getMarket);

router.get(
  "/market/productDetails/:productId",
  clientController.getProductDetails
);

router.get(
  "/market/productDetails/:productId/:marketerId",
  clientController.getProductDetails
);

router.post(
  "/addToCart/:productId",
  isAuth.authClient,
  clientController.getAddToCart
);

router.get("/cart", isAuth.authClient, clientController.getCart);

router.post(
  "/deleteCartItem",
  isAuth.authClient,
  clientController.postDeleteCartItem
);

router.get("/checkOut", isAuth.authClient, clientController.getCheckOut);

// router.get(
//   "/checkOut/success",
//   isAuth.authClient,
//   clientController.getCheckOutSuccess
// );

router.post(
  "/checkOut/postPaid/order",
  isAuth.authClient,
  clientController.getCheckOutSuccess
);

router.get("/checkOut/cancel", isAuth.authClient, clientController.getCheckOut);

router.get("/orders", isAuth.authClient, clientController.getOrders);

router.post(
  "/product/rating",
  isAuth.authClient,
  clientController.postProductRating
);

router.get(
  "/client/profile",
  isAuth.authClient,
  clientController.getClientProfile
);

router.post(
  "/client/confirm/profile",
  isAuth.authClient,
  clientController.postConfirmProfile
);

router.get("/show/listItems", clientController.getShowList);

router.get("/region/shippingTable", clientController.getShippingTable);

router.get("/aboutUs", clientController.getAboutUs);

router.get("/contactUs", clientController.getContactUs);

module.exports = router;
