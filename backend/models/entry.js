const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const entrySchema = new Schema({
  _id: {type: "String", required: true},
  start: {type: "String", required: true},
  end: {type: "String", required: true},
  clue: {type: "String", required: true} ,
  pattern: [{type: "String"}]
});

const Entry = mongoose.model("Entry", entrySchema);
module.exports = Entry

