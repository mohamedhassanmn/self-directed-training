const path = require("path");

const express = require("express");

const { currentWorkingDirLoc } = require("./helpers");

const port = 3000;

const app = express();

const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const staticFilesPath = path.join(currentWorkingDirLoc, "public");
const homeHtmlPath = path.join(currentWorkingDirLoc, "views", "home.html");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(staticFilesPath));

app.use("/admin", adminRoutes);
app.use("/products", userRoutes);

app.use("/", (_req, res) => {
  res.sendFile(homeHtmlPath);
});

app.listen(port);
