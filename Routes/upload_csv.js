const express = require("express");
const { uuid } = require("uuidv4");
const { AuthenticateToken } = require("../Middlewares/AuthenticateToken");
const router = express.Router();
const contact = require("../Modals/contacts");
const { Error, Success } = require("../Modules/Response");
const { ReadCSV } = require("../Modules/ReadCSV");
const { RemoveFile } = require("../Modules/tool");

router.post("/", AuthenticateToken, async (req, res) => {
  try {
    const file = req.files?.csv;

    if (!file || (file && file.name.search(".csv") == -1)) {
      RemoveFile(file.tempFilePath);
      return Error(res, "Only CSV is Accepted", 422);
    }

    const filename = uuid();
    const path = "./tmp/" + filename + ".csv";

    file.mv(path, (err) => {
      // RemoveFile(file.name);
      if (err) {
        RemoveFile(path);
        return Error(res, undefined, undefined, err);
      } else {
        return ReadCSV(res, path);
      }
    });

    // return Success(res);
  } catch (err) {
    console.log(err);
    return Error(res, undefined, undefined, err);
  }
});


module.exports = router;
