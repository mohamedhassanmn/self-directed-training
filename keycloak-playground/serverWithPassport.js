require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { Strategy } = require("passport-openidconnect");

const app = express();

// Session setup (stores login state)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport strategy for Keycloak OpenID Connect
passport.use(new Strategy({
  issuer: `${process.env.KEYCLOAK_ISSUER}`,
  clientID: process.env.KEYCLOAK_CLIENT_ID,
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  authorizationURL: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
  tokenURL: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
  userInfoURL: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
  callbackURL: "http://localhost:3000/auth/callback",
  scope: ["openid", "profile", "email"]
}, (issuer, profile, context, idToken, accessToken, refreshToken, done) => {
  return done(null, profile);
}));

// Serialize user into session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send(`<h1>Welcome</h1><a href="/auth">Login with Keycloak</a>`);
});

app.get("/auth", passport.authenticate("openidconnect"));

app.get("/auth/callback",
  passport.authenticate("openidconnect", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(`<h1>Hello, ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
});

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
