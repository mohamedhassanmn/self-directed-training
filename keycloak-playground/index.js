require("dotenv").config();
const express = require("express");
const session = require("express-session");
const axios = require("axios");
const qs = require("querystring");

const app = express();

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Keycloak Endpoints
const KEYCLOAK_ISSUER = process.env.KEYCLOAK_ISSUER;
const AUTH_URL = `${KEYCLOAK_ISSUER}/protocol/openid-connect/auth`;
const TOKEN_URL = `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
const USERINFO_URL = `${KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`;

const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/auth/callback";

// Home route
app.get("/", (req, res) => {
  if (req.session.user) {
    res.send(
      `<h1>Welcome, ${req.session.user.name}</h1><a href="/logout">Logout</a>`
    );
  } else {
    res.send(`<h1>Welcome</h1><a href="/login">Login with Keycloak</a>`);
  }
});

// Step 1: Redirect user to Keycloak login
app.get("/login", (req, res) => {
  const authParams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "openid profile email",
  });

  res.redirect(`${AUTH_URL}?${authParams.toString()}`);
});

// Step 2: Handle callback & exchange code for tokens
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send("Error: No code received");

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await axios.post(
      TOKEN_URL,
      qs.stringify({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, id_token } = tokenResponse.data;

    // Fetch user info
    const userInfoResponse = await axios.get(USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Store user in session
    req.session.user = userInfoResponse.data;

    res.redirect("/");
  } catch (error) {
    console.error("Auth Error:", error.response?.data || error.message);
    res.send("Authentication failed.");
  }
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect(
      `${KEYCLOAK_ISSUER}/protocol/openid-connect/logout?redirect_uri=http://localhost:3000/`
    );
  });
});

// Start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
