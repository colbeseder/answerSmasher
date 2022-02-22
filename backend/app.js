const express = require('express')
const mongoose = require("mongoose");
const Entry = require('./models/entry');
const Smash = require('./models/smash')
const Raw = require('./models/raw')


const app = express();
app.use(express.json());

const port = 3000

// Connection URI
const MongoURI = process.argv[2];
console.log(`MongoURI is ${MongoURI}`)
mongoose.connect(MongoURI)
  .then(result => {
    console.log("Backend app.js Connected to Mongo");
    go();
  })
  .catch(err => {console.log("Backend app.js failed to connect to Mongo");console.log(err)})

function getRandomDoc(model, cb){
  model.count().exec(function(err, count){
    var random = Math.floor(Math.random() * count);
    
    model.findOne().skip(random).exec(
      function (err, result) {
        if (err){
          console.log(err)
        }
        else{
          cb(result);
        }
    });
  
  });
}

app.get('/', (req, res) => {
  res.send(`This is the backend! (${Date.now()})`)
})

app.post('/api/entry/:title', (req, res) => {
  var entry = new Entry({
    _id: req.params.title,
    start: req.body.start,
    end: req.body.end,
    clue: req.body.clue
  });
  entry.save()
    .then(result => {
      //console.log(result);
      res.send(result)})
    .catch(err => res.send(err));
});

app.get('/api/entry/:title', (req, res) => {
  Entry.findById(req.params.title).then(result => res.send(result))
});

app.get('/api/entryByStart/:start', (req, res) => {
  Entry.find({start: req.params.start}, function(err, docs){
    var choice = Math.floor(Math.random() * docs.length)
    res.send(docs[choice])
  })
});

app.get('/api/q', (req, res) => {
  getRandomDoc(Raw, result => res.send(result));
});

app.get('/api/randomEntry', (req, res) => {
  getRandomDoc(Entry, result => res.send(result));
});

app.get('/api/status', (req, res) => {
  Entry.count().exec(function(err, count){res.send(`${count} Entries`)})
});

function go(){
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    //Raw.count().exec(function(err, count){console.log(`There are ${count} queued entries`)})
  })
}
