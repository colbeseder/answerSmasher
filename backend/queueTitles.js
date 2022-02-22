const mongoose = require("mongoose");
const { off, exit } = require("process");
const Raw = require('./models/raw')


const MongoURI = process.argv[2];

function insertAllRaw(offset){
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('resources/titles')
  });
  
  var lineNumber = 0;
  console.log(`Offset: ${offset}`)
  lineReader.on('line', function (line) {
    lineNumber++;
    if (lineNumber >= offset){
      var raw = new Raw({
        _id: line.trim().toLocaleLowerCase()
      });
      raw
        .save()
        //.then(result => console.log(result))
        .catch(err => null);
    }
    if (lineNumber > (offset + 100)){
      lineReader.close();
    }

    
  });
}

function deleteAllRaw(){
  mongoose.connection.db.dropCollection('raw', function(err, result) {});
}

var offset = 0;
function go(){
  Raw.count().exec(function(err, count){insertAllRaw(count || 0)})
}

mongoose.connect(MongoURI)
  .then(result => {
    console.log("queueTitles.js Connected to Mongo");
    go();
    setInterval(go, 60000);
  })
  .catch(err => console.log(err))