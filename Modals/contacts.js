const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactSchema = new Schema(
  {
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
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    "linkedin profile url": {
      type: String,
      trim: true,
      required: true,
      default: "",
    },
  },
  { timestamps: { createdAt: "created_at" } },
  { collection: "contacts" }
);

module.exports = mongoose.model("contacts", ContactSchema);
