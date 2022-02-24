const express = require('express')
const mongoose = require('mongoose');
const atob = require('atob');
const Entry = require('./models/entry');
const Smash = require('./models/smash')
const Raw = require('./models/raw')


const app = express();
var cors = require('cors');
app.use(cors());
app.use(express.json());

const port = 3000

// Connection URI
const MongoURI = process.argv[2];
var isConnected = false;

mongoose.connect(MongoURI)
  .then(result => {
    console.log("Backend app.js Connected to Mongo");
    isConnected = true;
  })
  .catch(err => {console.log("Backend app.js failed to connect to Mongo");console.log(err)})

function getRandomDoc(model){
  return new Promise((resolve, reject) => {
    model.count().exec(function(err, count){
      if (count ===0){
        resolve();
        return;
      }
      var random = Math.floor(Math.random() * count);
      
      model.findOne().skip(random).exec(
        function (err, result) {
          if (err){
            reject(err)
          }
          else{
            resolve(result);
          }
      });
    });
  })
}

app.get('/', (req, res) => {
  res.send(`This is the backend! (${Date.now()})<br>Mongo ${isConnected ? 'IS' : 'IS NOT' } connected`)
})

app.post('/api/entry/:title', (req, res) => {
  if(!isConnected) {
    res.send('Not ready')
  }
  if (req.params.success === false){
    Raw.deleteOne({ _id: req.params.title}).catch();
    res.send(req.params);
    return;
  }
  var entry = new Entry({
    _id: req.params.title,
    start: req.body.start,
    end: req.body.end,
    clue: req.body.clue,
    pattern: req.body.pattern
  });
  entry.save()
    .then(result => {
      //console.log(result);
      res.send(result);
      Raw.deleteOne({ _id: req.params.title});
    })
    .catch(err => res.send(err));
});

app.get('/api/entry/:title', (req, res) => {
  if(!isConnected) {
    res.send('Not ready')
  }
  Entry.findById(req.params.title).then(result => res.send(result))
});

function combine(first, second){
  var pronounciation = [...first.pattern]
  pronounciation.push(...second.pattern.slice(3))
  var smash = {
    firstAnswer: first._id,
    firstClue: first.clue,
    secondAnswer: second._id,
    secondClue: second.clue,
    pronounciation: pronounciation.join('')
  }
  return smash;
}

function findPair(first){
  return new Promise((resolve, reject) => {
    getEntryByStart(first.end).then(second => {
      try {
        var smash = combine(first, second);
        resolve(smash)
      }
      catch (err){
        reject(err);
      }
    });
  });
}

app.get('/api/smash', (req, res) => {
  if(!isConnected) {
    res.send('Not ready')
  }
  getRandomDoc(Entry)
    .then(result => findPair(result))
    .then(pair => res.send(pair))
    .catch(err => res.send(err));
});


app.get('/api/combine/:digest', (req, res) => {
  if(!isConnected) {
    res.send('Not ready')
  }
  try {
    var uncoded = atob(req.params.digest);
    var words = uncoded.split(',');
    Promise.all([
      Entry.findById(words[0]),
      Entry.findById(words[1])])
        .then(function(entries){
          res.send(combine(entries[0], entries[1]))
        })
        .catch(er => res.send(er));
  }
  catch(er){
    res.send(er);
  }
});

function getEntryByStart(start){
  return new Promise((resolve, reject) => {
    Entry.find({start: start}, function(err, docs){
      var choice = Math.floor(Math.random() * docs.length)
      resolve(docs[choice])
    });
  });
}

app.get('/api/entryByStart/:start', (req, res) => {
  if(!isConnected) {
    res.send('Not ready');
  }
  getEntryByStart(req.params.start).then(entry => res.send(entry));
});

app.get('/api/q', (req, res) => {
  if(!isConnected) {
    res.send('Not ready')
  }
  getRandomDoc(Raw).then(result => res.send(result));
});

app.get('/api/randomEntry', (req, res) => {
  if(!isConnected) {
    res.send('Not ready')
  }
  getRandomDoc(Entry).then(result => res.send(result));
});

app.get('/api/status', (req, res) => {
  if(!isConnected) {
    res.send('Not ready')
  }
  Entry.count().exec(function(err, count){res.send(`${count} Entries`)})
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
