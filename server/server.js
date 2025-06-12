const { urlencoded } = require('body-parser')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = 8080

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.json())
app.use(urlencoded({ extended: true }))

app.post('/register', (req, res) => {
    res.send('Hello')
})

server.listen(port, () => {
    console.log(`SERVER STARTED ON ${port}`)
})
