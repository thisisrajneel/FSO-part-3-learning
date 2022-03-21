const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongodb.js <password>');
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://rajneel:${password}@cluster0.i7ait.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note',noteSchema)

const note = new Note({
    content: 'This is the third note',
    date: new Date(),
    important: true,
})

// note.save().then(result => {
//     console.log('note saved!');
//     mongoose.connection.close()
// })

Note.find({}).then(note => {
    note.forEach(n => {
        console.log(n);
    })

    mongoose.connection.close()
})