const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  ip: {type: "String"}, //, required: true},
  page: {type: "String"} //, required: true}
}, {timestamps: true});

const Visit = mongoose.model("Visit", visitSchema);
module.exports = Visit

