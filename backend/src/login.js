//npm init-i
// nodemon index.js

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public')) // use to serve/load images,CSS files and javascript files in public folder

// app.get or app.post or app.put or app.delete(path, handler)
app.get('/', (req, res) => {
  console.log('Hey its a get request')
  res.send('hello world !')
})

/* app.get('/blog/', (req, res) => {
    // logic to fetch intro to js from the db
  res.send('Hello intro-to-js')
}) */

app.post('/',(req,res)=>{
    console.log("Hey its a post request")
    res.send('Hello World post!')
})

app.get('/index',(req,res)=>{
    console.log("Hey its index")
    // Serve HTML File through res.send
    res.sendFile('templates/index.html', {root: __dirname})
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})