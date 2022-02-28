const express = require('express')
const app = express()
const port = 3001

app.use("/scripts", express.static('static/scripts'))
app.use("/styles", express.static('static/styles'))
app.use("/JSX", express.static('static/JSX'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
