const { urlencoded } = require('body-parser')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const util = require('./util')
const supabase = require('@supabase/supabase-js')
const dotenv = require('dotenv')

const generateSHA256 = require('./secure_hash')

dotenv.config()

const port = 8080

const supabaseUrl = process.env.supabaseUrl
const supabaseKey = process.env.supabaseKey

const client = supabase.createClient(supabaseUrl, supabaseKey)

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.json())
app.use(urlencoded({ extended: true }))

app.post('/register', async (req, res) => {
    if (!util('username', Object.keys(req.body))) {
        res.status(400).send({ 'missing-field': '"username" field is missing' })
        return
    }
    if (!util('password', Object.keys(req.body))) {
        res.status(400).send({ 'missing-field': '"password" field is missing' })
        return
    }

    const hashed_password = generateSHA256(req.body.password)
    const { error } = await client.from('admins').insert({ 'username': req.body.username, 'hashed_password': hashed_password })

    res.status(200).send({ "Success": "User registered" })
})

server.listen(port, () => {
    console.log(`SERVER STARTED ON ${port}`)
})
