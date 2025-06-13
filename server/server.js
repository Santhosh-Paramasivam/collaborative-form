// REMEMBER TO SET AN EXPIRY DATE FOR THE JWT TOKEN

const { urlencoded } = require('body-parser')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const supabase = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')


const generateSHA256 = require('./secure_hash')
const findInList = require('./find_in_list')
const required_field_missing = require('./required_field_missing')

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
    const required_fields = ['username', 'password', 'role']

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
    const required_fields = ['username', 'password', 'role']

    if (required_field_missing(required_fields, req.body, res)) return

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

app.post('/create_form', (req, res) => {
    if (!req.headers.authorization) {
        console.log(req.headers.authorization)
        res.status(401).send({ "Unauthorized": "Authorization header missing" })
        return
    }

    const token = req.headers.authorization.trim().slice(7)

    if (!token) {
        res.status(401).send({ "Unauthorized": "JWT token missing" })
        return
    }

    let decodedObject
    try {
        decodedObject = jwt.verify(token, secretKey, { complete: true })
    } catch {
        res.status(401).send({ "Unauthorized": "JWT token malformed" })
        return
    }

    if (decodedObject.role != 'admin') {
        res.status(401).send({ "Unauthorized": "Permission Denied" })
        return
    }

    const { data, error } = client.from('forms').insert({})

})

server.listen(port, () => {
    console.log(`SERVER STARTED ON ${port}`)
})
