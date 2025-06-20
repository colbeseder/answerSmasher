

const path = require('path');
const express = require('express');
const app = express();
const port = 3001;

app.use("/static", express.static(path.join(__dirname, './static')))

app.get('/', (req, res) => {
  res.redirect('/quiz');
  //res.sendFile(__dirname + '/static/quiz.html');
})

app.get('/quiz', (req, res) => {
  res.sendFile(__dirname + '/static/quiz.html');
})

app.get('/daily', (req, res) => {
  res.sendFile(__dirname + '/static/quiz.html');
})

app.get('/compose', (req, res) => {
  res.sendFile(__dirname + '/static/compose.html');
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
