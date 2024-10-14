const express = require("express");

const { products } = require("./adminRoutes");

const router = express.Router();

router.get("/", (_req, res) => {
  res.render("productList", {
    pageTitle: "Products",
    products: products,
    isNonEmptyList: products.length > 0,
  });
});

module.exports = router;
