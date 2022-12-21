const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");
const { Success, Error } = require("./Response");
const contacts = require("../Modals/contacts");
const { RemoveFile } = require("./tool");

const ReadCSV = (res, path) => {
  var result = [];

  try {
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (data) => result.push(data))
      .on("end", () => {
        return Promise.all(
          result.map((e, index) => {
            const { error, value } = schema.validate(e);
            var obj = new Object(value);
            if (error !== undefined) {
              // Assigning Error LINE NUMBER
              obj.error_in_line_number = index + 1;
            }
            return obj;
          })
        ).then((data) => {
          let failed = data.filter(
            (e) => e?.error_in_line_number !== undefined
          );

          if (failed.length == 0) {
              const contactsData = data.map((x)=>new contacts(x))
            contacts.bulkSave(contactsData).then(() => {
                RemoveFile(path);
                return Success(res, "CSV Data saved Successfully",data);
              })
              .catch((err) => {
                RemoveFile(path);
                return Error(res, "Something went wrong", undefined, err);
              });

          } else {
            RemoveFile(path);
            return Error(res, "Error in CSV", 401, failed);
          }
        });
      });
  } catch (error) {
    console.log(error);
  }
};




const schema = Joi.object().keys({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().required(),
  "linkedin profile url": Joi.string().uri().trim().required(),
});

module.exports = { ReadCSV };
