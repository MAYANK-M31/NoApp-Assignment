const express = require("express");
const fs = require("fs");
const { uuid } = require("uuidv4");
const { AuthenticateToken } = require("../Middlewares/AuthenticateToken");
const router = express.Router();
const contact = require("../Modals/contacts");
const { Error, Success } = require("../Modules/Response");
const { ReadCSV } = require("../Modules/ReadCSV");
const { RemoveFile } = require("../Modules/tool");
const contacts = require("../Modals/contacts");

router.post("/", AuthenticateToken, async (req, res) => {
  try {
    const file = req.files?.csv;

    if (!file || (file && file.name.search(".csv") == -1)) {
      RemoveFile(file.tempFilePath);
      return Error(res, "Only CSV is Accepted", 422);
    }

    fs.renameSync(file.tempFilePath, file.tempFilePath + ".csv");
    var filename = file.tempFilePath.split("/");
    filename = filename[filename.length - 1];

    const path = "./tmp/" + filename + ".csv";

    const data = await ReadCSV(path);

    if (data?.status !== 200)
      return Error(res, data?.message, data?.status, data?.data);

    const contactsData = data?.data?.map((x) => new contacts(x));
    contacts
      .bulkSave(contactsData)
      .then(() => {
        RemoveFile(path);
        return Success(res, "CSV Data saved Successfully", data?.data);
      })
      .catch((err) => {
        RemoveFile(path);
        return Error(res, "Something went wrong", undefined, err);
      });

    // return Success(res);
  } catch (err) {
    console.log(err);
    RemoveFile(path);
    return Error(res, undefined, undefined, err);
  }
});

module.exports = router;
