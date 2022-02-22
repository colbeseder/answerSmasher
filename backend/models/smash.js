const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const smashSchema = new Schema({
    firstAnswer: {type: "String", required: true},
    firstClue: {type: "String", required: true},
    secondAnswer: {type: "String", required: true},
    secondClue: {type: "String", required: true}
  });

const Smash = mongoose.model("Smash", smashSchema);
module.exports = Smash
