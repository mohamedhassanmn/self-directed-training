const path = require("path");

const express = require("express");

const { currentWorkingDirLoc } = require("../helpers");

const productFromHtmlPath = path.join(
  currentWorkingDirLoc,
  "views",
  "addProductForm.html"
);

const router = express.Router();

router.get("/product-form", (_req, res) => {
  res.sendFile(productFromHtmlPath);
});

router.post("/new-product", (req, res) => {
  console.log(req.body, "req.body");
  res.redirect("/admin/product-form?submitStatus=success");
});

module.exports = router;
