const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactSchema = new Schema(
  {
    uuid: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    linkedin_url: {
      type: String,
      trim: true,
      required: true,
      default: "",
      unique: true,
    },
  },
  { timestamps: { createdAt: "created_at" } },
  { collection: "contacts" }
);

module.exports = mongoose.model("contacts", ContactSchema);
