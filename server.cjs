const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");
const { auth, requiresAuth } = require("express-openid-connect");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require('cors')

const api = require("./server/api/index.cjs");

const fs = require("fs");
const https = require("https");

require("dotenv").config();

// https
const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");

const app = express();
const port = process.env.PORT;

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: `${process.env.BASE_URL}:${process.env.PORT}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET,
};

app.use(cors())
app.use(auth(config));
app.use(express.static(path.join(__dirname, "/dist")));
app.disable("x-powered-by");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/", api);

app.get("/", function (req, res) {
  console.log({ isAuthenticated: req.oidc.isAuthenticated() });
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

app.get("/profile", requiresAuth(), function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/profile.html"));
});

app.get("/album", function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/album.html"));
});

app.get("/posts/:id/", function (req, res) {
  const { id } = req.params;
  console.log({ post: id });
  res.cookie("postId", id, { maxAge: 900000, httpOnly: true });
  res.sendFile(path.join(__dirname, "/dist/posts/[post]/index.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/404/404.html"));
});

// https.createServer({ key, cert }, app).listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
