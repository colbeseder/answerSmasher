const express = require('express');
const mongoose = require('mongoose');
const atob = require('atob');
const combineSpelling = require('./combineSpelling');
const getChallenge = require('./getChallenge');
const Entry = require('./models/entry');
const Smash = require('./models/smash');
const Visit = require('./models/visit');

const entry_api_key = process.env.ENTRY_API_KEY ;

const app = express();
var cors = require('cors');
app.use(cors());
app.use(express.json());

const port = 3000

const isProd = process.env.IS_PROD !== "no";

// Connection URI
var MongoURI = `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASS}${process.env.MONGO_URI}`;
if (!isProd){
  MongoURI = `mongodb://${process.env.MONGO_URI}`;
}
var isConnected = false;

function validateAPIKey(req, key){
  return req.get("X-API-Key") === key;
}

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

function combine(first, second){
  var pronounciation = [...first.pattern]
  pronounciation.push(...second.pattern.slice(3))
  var smash = {
    firstAnswer: first._id,
    firstClue: first.clue,
    secondAnswer: second._id,
    secondClue: second.clue,
    firstTarget: first.target,
    secondTarget: second.target,
    pronounciation: pronounciation.join('')
  }
  return smash;
}

const maxRetries = 10;

function findPair(limit){
  limit = limit || maxRetries; //Don't retry forever
  return new Promise((resolve, reject) => {
    var entry = getRandomDoc(Entry)
      .then(first => {
        getEntryByStart(first.end).then(second => {
          try {
            if (!first || !second){
              throw 'No match';
            }
            var canMergeSpelling = combineSpelling(first._id, second._id, true);
            if (!canMergeSpelling){
              throw 'Failed to merge spelling';
            }
            var smash = combine(first, second);
            resolve(smash)
          }
          catch (err){
            if (limit <= 1){
              reject({error: "Exceeded retries"})
            }
            else {
              findPair(limit-1)
                .then(pair => resolve(pair))
                .catch(e => reject(e))
            }
          }
        });
    });
  });
}

function getEntryByStart(start){
  return new Promise((resolve, reject) => {
    Entry.find({start: start}, function(err, docs){
      var choice = Math.floor(Math.random() * docs.length)
      resolve(docs[choice])
    });
  });
}

app.get('/', (req, res) => {
  res.send(`This is the backend! (${Date.now()})<br>Mongo ${isConnected ? 'IS' : 'IS NOT' } connected.`)
})

app.post('/api/entry/:title', (req, res) => {
  if(!validateAPIKey(req, entry_api_key)){
    res.statusCode = 401;
    res.send('Invalid or expired API Key')
    return;
  }
  if(!isConnected) {
    res.status(502);
    res.send('Not ready')
    return;
  }
  if (req.params.success === false){
    res.send(req.params);
    return;
  }
  var entryData = {
    _id: req.params.title,
    start: req.body.start,
    end: req.body.end,
    clue: req.body.clue,
    definition: req.body.definition || req.body.clue,
    pattern: req.body.pattern,
    target: req.body.target,
    version: req.body.version || 0
  };

  Entry.findOneAndUpdate({ _id: entryData._id }, entryData, {upsert: true}, function(err, result) {
    if (err) {
      res.send(err)
    }
    else {
      res.send(result);
    }
  });
});

app.get('/api/entry/:title', (req, res) => {
  if(!isConnected) {
    res.status(502);
    res.send('Not ready')
    return;
  }
  Entry.findById(req.params.title).then(result => res.send(result))
});

app.get('/api/smash', (req, res) => {
  if(!isConnected) {
    res.status(502);
    res.send('Not ready');
    return;
  }
  try {
    logVisit(req);
    findPair()
      .then(pair => res.send(pair))
      .catch(err => res.status(503).send(err));
  }
  catch(err){
    res.send(err);
  }
});

function getByDigest(digest, resolve, reject){
  var uncoded = atob(digest);
  var words = uncoded.split(',');
  Promise.all([
    Entry.findById(words[0]),
    Entry.findById(words[1])])
      .then(function(entries){
        resolve(combine(entries[0], entries[1]))
      })
      .catch(er => reject(er))
}

app.get('/api/combine/:digest', (req, res) => {
  if(!isConnected) {
    res.status(502);
    res.send('Not ready');
    return;
  }
  try {
    logVisit(req);
    getByDigest(req.params.digest, x => res.send(x), x => res.status(404).send(x));
  }
  catch(er){
    res.send(er);
  }
});

app.get('/api/daily', (req, res) => {
  if(!isConnected) {
    res.status(502);
    res.send('Not ready');
    return;
  }
  try {
    logVisit(req);
    getByDigest(getChallenge(), x => res.send(x), x => res.status(404).send(x));
  }
  catch(er){
    res.send(er);
  }
});

app.get('/api/randomEntry', (req, res) => {
  if(!isConnected) {
    res.status(502);
    res.send('Not ready');
    return;
  }
  getRandomDoc(Entry).then(result => res.send(result));
});

app.get('/api/status', (req, res) => {
  if(!isConnected) {
    res.status(502);
    res.send('Not ready');
    return;
  }
  Entry.count().exec(function(err, count){res.send(`${count} Entries`)})
});

app.get('/api/visits', (req, res) => {
  if(!isConnected) {
    res.status(502)
    res.send('Not ready');
    return;
  }
  Visit.count().exec(function(err, count){res.send(`${count} Visits`)})
});

function logVisit(req){
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // XFF Only works on LoadBalancer (prod), Not NodePort (local)
  var ref = req.get('Referrer');
  var ua = req.get('User-Agent');
  var visit = new Visit({
    ip: ip,
    ua: ua,
    page: ref
  }).save();
}

var connectionRetryInterval = 1; // seconds

function connectToDB(){
  mongoose.connect(MongoURI)
    .then(result => {
      var t = Math.round((Date.now() - bootTime)/100) / 10; // 1 decimal place
      console.log(`Backend app.js Connected to Mongo after ${t} seconds`);
      isConnected = true;
    })
    .catch(err => {
      console.log(`Failed to connect to Mongo. Retry in ${connectionRetryInterval} seconds`);
      //console.log(err);
      setTimeout(connectToDB, connectionRetryInterval * 1000);
      connectionRetryInterval *= 2 ; // exponential backoff
    });
}

var bootTime = Date.now();
connectToDB();

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
