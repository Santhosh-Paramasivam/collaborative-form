const { urlencoded } = require('body-parser')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const findInList = require('./findInList')
const supabase = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const generateSHA256 = require('./secure_hash')
const jwt = require('jsonwebtoken')

const { table } = require('console')

dotenv.config()

const port = 8080

const supabaseUrl = process.env.supabaseUrl
const supabaseKey = process.env.supabaseKey
const secretKey = process.env.secretKey

const client = supabase.createClient(supabaseUrl, supabaseKey)

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.json())
app.use(urlencoded({ extended: true }))

app.post('/register', async (req, res) => {
    if (!findInList('username', Object.keys(req.body))) {
        res.status(400).send({ 'missing-field': '"username" field is missing' })
        return
    }
    if (!findInList('password', Object.keys(req.body))) {
        res.status(400).send({ 'missing-field': '"password" field is missing' })
        return
    }
    if (!findInList('role', Object.keys(req.body))) {
        res.status(400).send({ 'missing-field': '"role" field is missing' })
        return
    }

    const hashed_password = generateSHA256(req.body.password)

    const table = req.body.role + 's'

    const { error } = await client.from(table).insert({ 'username': req.body.username, 'hashed_password': hashed_password })

    if (error && error.code == "23505") {
        res.status(400).send({ "Bad Request": "Username already exists" })
        return
    }
    if (error) {
        res.status(500).send({ "Interal Server Error": error })
    }

    res.status(200).send({ "Success": "User registered" })
})

app.get('/login', async (req, res) => {
    if (!findInList('username', Object.keys(req.body))) {
        res.status(400).send({ 'missing-field': '"username" field is missing' })
        return
    }
    if (!findInList('password', Object.keys(req.body))) {
        res.status(400).send({ 'missing-field': '"password" field is missing' })
        return
    }
    if (!findInList('role', Object.keys(req.body))) {
        res.status(400).send({ 'missing-field': '"role" field is missing' })
        return
    }

    const table = req.body.role + 's'

    const { data, error } = await client.from(table).select().eq('username', req.body.username)

    if (data.length == 0) {
        res.status(400).send({ "invalid-credentials": "Username or password incorrect" })
        return
    }

    if (data[0].hashed_password != generateSHA256(req.body.password)) {
        res.status(400).send({ "invalid-credentials": "Username or password incorrect" })
        return
    }

    const token = jwt.sign({
        id: data[0].id,
        role: req.body.role
    }, secretKey, { algorithm: 'HS256' })

    res.status(201).send({ "Sucess": "User logged in successfully", "token": token })
})

server.listen(port, () => {
    console.log(`SERVER STARTED ON ${port}`)
})
