const { Schema, model, connection } = require("mongoose");

const noteSchema = new Schema({
  title: String,
  body: String,
  author: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

noteSchema.index({ title: "text", body: "text" });

let modelName = "notes";
module.exports =
  connection && connection.models[modelName]
    ? connection.models[modelName]
    : model(modelName, noteSchema);
