const express = require("express");
const path = require("path");
const { currentWorkingDirLoc } = require("../helpers");

const productHtmlPath = path.join(
  currentWorkingDirLoc,
  "views",
  "product.html"
);
const productPdfPath = path.join(currentWorkingDirLoc, "sample.pdf");

const router = express.Router();

router.get("/", (_req, res) => {
  res.sendFile(productHtmlPath);
});

router.get("/pdf", (_req, res) => {
  res.sendFile(productPdfPath);
});

module.exports = router;
