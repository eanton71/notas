const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)

///MONGoose

const mongoose = require('mongoose')

 

const password = 'fullstackopen'
const username = 'eanton71'
const dbName = 'noteApp'
const url =
    `mongodb+srv://${username}:${password}@cluster19070.wvq4dny.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster19070`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)


///mongoose
app.use(cors())
app.use(express.static('dist'))
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


app.post('/api/notes', (request, response) => {
    const note = request.body
    console.log(note)
    console.log(request.headers)
    response.json(note)
})
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const note = notes.find(note => note.id === id)

    
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})
app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})