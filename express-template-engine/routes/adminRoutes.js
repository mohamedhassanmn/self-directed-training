const express = require("express");

const router = express.Router();

const productList = [];

router.get("/", (req, res) => {
  const status = req?.query?.status;
  res.render("addProducts", {
    pageTitle: "Add Products",
    status: status == "success",
  });
});

router.post("/add-products", (req, res) => {
  const body = req.body;
  productList.push({ ...body });
  res.render("addProducts", { pageTitle: "Add Products", status: "success" });
});

exports.routes = router;
exports.products = productList;
