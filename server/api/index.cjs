const express = require("express");
const { requiresAuth } = require("express-openid-connect");

const router = express.Router();

router.get("/profile", requiresAuth(), function (req, res) {
  console.log({ profile: req.oidc.user });
  return res.status(200).send({
    data: req.oidc.user,
  });
});

module.exports = router