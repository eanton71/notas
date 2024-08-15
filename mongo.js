const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const username = 'eanton71'
const dbName = 'testnoteApp'
const url =
    `mongodb+srv://${username}:${password}@cluster19070.wvq4dny.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster19070`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

let note = new Note({
    content: 'HTML is easy',
    important: true,
})

let note1 = new Note({
    content: 'Como me gusta el pasodoble',
    important: false,
})
let note2 = new Note({
    content: 'Browser can execute only JavaScript',
    important: false,
})
let note3 = new Note({
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
})
// Save all notes in parallel
Promise.all([note.save(), note1.save(), note2.save(), note3.save()])
    .then(() => {
        console.log('Notes saved!')
        // Find all notes
        return Note.find({})
    })
    .then(notes => {
        notes.forEach(note => console.log(note))
    })
    .catch(error => {
        console.error('Error saving or finding notes:', error)
    })
    .finally(() => {
        mongoose.connection.close()
    })
/*
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})*/
 