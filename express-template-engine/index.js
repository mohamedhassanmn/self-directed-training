const path = require("path");

const express = require("express");
const expressHbs = require("express-handlebars").engine;

const app = express();

const { rootPath } = require("./helper");

const { routes: adminRoutes } = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const port = 3000;

app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts",
    defaultLayout: "mainLayout",
    extname: "hbs",
  })
);

// app.set("view engine", "pug");
// app.set("view engine", "ejs");
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(rootPath, "public")));

app.use("/admin", adminRoutes);
app.use("/", userRoutes);

app.listen(port, () => {
  console.log(`Server Listening at ${port}!`);
});
