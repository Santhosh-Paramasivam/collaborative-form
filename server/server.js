const cors = require('cors')
const { urlencoded } = require('body-parser')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const supabase = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')


const generateSHA256 = require('./secure_hash')
const required_field_missing = require('./required_field_missing')
const authenticate = require('./authenticate')
const generate_random_string = require('./generate_string')

dotenv.config()

const port = 8080

const supabaseUrl = process.env.supabaseUrl
const supabaseKey = process.env.supabaseKey
const secretKey = process.env.secretKey

const client = supabase.createClient(supabaseUrl, supabaseKey)

const app = express()
const server = http.createServer(app)

const io = socketIO(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const corsOptions = {
    origin: ['http://localhost:5173']
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.post('/register', async (req, res) => {
    const required_fields = ['username', 'password', 'role']
    if (required_field_missing(required_fields, req.body, res)) return

    const hashed_password = generateSHA256(req.body.password)

    const table = req.body.role + 's'

    const { error } = await client.from(table).insert({ 'username': req.body.username, 'hashed_password': hashed_password })

    if (error && error.code == "23505") {
        res.status(400).send({ "Bad Request": "Username already exists" })
        return
    }
    if (error) {
        res.status(500).send({ "Interal Server Error": error })
        return
    }

    res.status(200).send({ "Success": "User registered" })
})

app.post('/login', async (req, res) => {
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
    }, secretKey, { algorithm: 'HS256', expiresIn: '2h' })

    res.status(201).send({ "Success": "User logged in successfully", "token": token })
})

app.post('/create_form', async (req, res) => {
    const required_fields = ['form_name'];
    if (required_field_missing(required_fields, req.body, res)) return

    const decodedObject = authenticate(req, res, secretKey)

    if (!decodedObject) return

    if (decodedObject.role != 'admin') {
        res.status(401).send({ "Unauthorized": "Permission Denied" })
        return
    }

    const { data, error } = await client.from('forms').insert({ name: req.body.form_name, admin_id: decodedObject.id, path: generate_random_string(10) }).select()

    if (error) {
        console.log(error)
        res.status(500).send({ "Internal Server Error": "Unexpected Error" })
        return
    }

    res.status(201).send({ "Success": "Form successfully created", "form_id": data[0].id })
})

app.post('/append_to_form', async (req, res) => {
    const required_fields = ['form_id', 'input_type', 'form_item_value'];
    if (required_field_missing(required_fields, req.body, res)) return

    const decodedObject = authenticate(req, res, secretKey)

    if (!decodedObject) return

    if (decodedObject.role != 'admin') {
        res.status(401).send({ "Unauthorized": "Permission Denied" })
        return
    }

    let form_item_value
    if (typeof (req.body.form_item_value) == typeof ([])) {
        form_item_value = req.body.form_item_value
    }
    else {
        form_item_value = [req.body.form_item_value]
    }

    const { error } = await client.from('form_items').insert({
        form_id: req.body.form_id,
        input_type: req.body.input_type,
        form_item_value: form_item_value,
        form_item_response: "NULL",
        form_item_user: 0
    })

    if (error && error.code == '22P02') {
        res.status(400).send({ "Bad Request": "Invalid Input Type" })
        return
    }

    if (error) {
        console.log(error)
        res.status(500).send({ "Internal Server Error": "Uncaught error occured" })
        return
    }

    res.status(200).send({ "Success": "Element appended to form" })
})

app.get('/get_form', async (req, res) => {
    const required_fields = ['form_id'];
    if (required_field_missing(required_fields, req.query, res)) return

    const decodedObject = authenticate(req, res, secretKey)

    if (!decodedObject) return

    if (decodedObject.role != 'admin') {
        res.status(401).send({ "Unauthorized": "Permission Denied" })
        return
    }

    var { data, error } = await client.from('forms').select().eq('id', req.query.form_id).eq('admin_id', decodedObject.id)

    if (error) {
        console.log(error)
        res.status(500).send({ "Internal Server Error": "Uncaught error occured" })
        return
    }

    console.log(data)
    let form_name = data[0].name

    var { data, error } = await client.from('form_items').select().eq('form_id', req.query.form_id)

    if (error) {
        console.log(error)
        res.status(500).send({ "Internal Server Error": "Uncaught error occured" })
        return
    }

    let form_data = {
        form_name: form_name
    }

    let form_items = []

    for (let item of data) {
        console.log(typeof (item.form_item_value))
        form_items.push({
            input_type: item.input_type,
            form_item_value: JSON.stringify(item.form_item_value),
            form_item_response: item.form_item_response,
            form_item_user: item.form_item_user
        })
    }

    form_data['form_items'] = form_items

    console.log(data)
    console.log(form_data)

    res.status(200).send(form_data)
})

app.get('/get_all_forms', async (req, res) => {
    const decodedObject = authenticate(req, res, secretKey)

    if (!decodedObject) return

    if (decodedObject.role != 'admin') {
        res.status(401).send({ "Unauthorized": "Permission Denied" })
        return
    }

    const { data, error } = await client.from('forms').select().eq('admin_id', decodedObject.id)

    if (error) {
        console.log(error)
        res.status(500).send({ "Internal Server Error": "Uncaught error occured" })
        return
    }

    res.status(200).send(data)
})

app.get('/get_form_by_path', async (req, res) => {
    const required_fields = ['form_path'];
    if (required_field_missing(required_fields, req.query, res)) return

    const decodedObject = authenticate(req, res, secretKey)

    if (!decodedObject) return

    if (decodedObject.role != 'admin') {
        res.status(401).send({ "Unauthorized": "Permission Denied" })
        return
    }

    var { data, error } = await client.from('forms').select().eq('path', req.query.form_path)

    if (error) {
        console.log(error)
        res.status(500).send({ "Internal Server Error": "Uncaught error occured" })
        return
    }

    console.log(data)
    let form_name = data[0].name
    let form_id = data[0].id

    var { data, error } = await client.from('form_items').select().eq('form_id', form_id)

    if (error) {
        console.log(error)
        res.status(500).send({ "Internal Server Error": "Uncaught error occured" })
        return
    }

    let form_data = {
        form_name: form_name
    }

    let form_items = []

    for (let item of data) {
        console.log(typeof (item.form_item_value))
        form_items.push({
            id: item.id,
            input_type: item.input_type,
            form_item_value: JSON.stringify(item.form_item_value),
            form_item_response: item.form_item_response,
            form_item_user: item.form_item_user
        })
    }

    form_data['form_items'] = form_items

    console.log(data)
    console.log(form_data)

    res.status(200).send(form_data)
})

io.on("connect", (socket) => {
    socket.emit('locked', { form_element_id: 0 })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
})

server.listen(port, () => {
    console.log(`SERVER STARTED ON ${port}`)
})
