const express = require("express");
const {
  AuthenticateToken,
} = require("../Middlewares/AuthenticateToken");
const router = express.Router();
const contact = require("../Modals/contacts");
const { Error } = require("../Modules/Response");

router.post("/", AuthenticateToken, async (req, res) => {
  try {
    return Error( res, error);
  } catch (err) {
    return Error( res, err);
  }
});


module.exports = router