const express = require('express')
const app = express()
const port = 8080

app.use(express.static(__dirname + "/static"))

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})