const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    uuid: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } },
  { collection: "admins" }
);

module.exports = mongoose.model("admins", AdminSchema);
