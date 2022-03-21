require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')
const { response } = require('express')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

const requestLogger = (req,res,next) => {
    console.log('Method: ',req.method);
    console.log('Path: ', req.path);
    console.log('Body: ', req.body);
    console.log('---');
    next()
}

app.use(requestLogger)

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if(error.name === 'CastError') {
        res.status(400).send({ error: 'Malformatted ID' })
    }

    next(error)
}

app.use(errorHandler)

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
]

app.get('/', (req,res) => {
    res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res, next) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
    .catch(error => next(error))
})

app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id).then(note => {
        if(note) {
            res.json(note)
        }
        else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
        .then( result => {
            res.status(204).end()
        })
        .catch(error => next(error))

})

app.post('/api/notes', (req, res, next) => {
    const body = req.body

    if(!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })
    
    note.save().then(savedNote=> {
        res.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (req, res, next) => {
    const body = req.body
  
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(req.params.id, note, { new: true })
      .then(updatedNote => {
        res.json(updatedNote)
      })
      .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})