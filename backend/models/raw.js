const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rawSchema = new Schema({
  _id: {type: "String", required: true}
});

const Raw = mongoose.model("Raw", rawSchema);
module.exports = Raw

