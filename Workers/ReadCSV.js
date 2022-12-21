const { parentPort } = require("worker_threads");

const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");
const { RemoveFile } = require("../Modules/tool");
const contacts = require("../Modals/contacts");

const ReadCSV = (path) => {
  var result = [];

  try {
    return new Promise((resolve, reject) => {
      fs.createReadStream(path)
        .on("error", (error) => {
          resolve({ data: [], status: 500 });
        })
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
              resolve({ data, status: 200 });
            } else {
              RemoveFile(path);
              resolve({ data: failed, status: 401, message: "Error in CSV" });
            }
          });
        });
    });
  } catch (error) {
    RemoveFile(path);
    console.log(error);
  }
};

const schema = Joi.object().keys({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().required(),
  "linkedin profile url": Joi.string().uri().trim().required(),
});

parentPort.on("message", async (path) => {
  // ReadCSV(path)
  parentPort.postMessage(await ReadCSV(path));
});

// module.exports = { ReadCSV };
