const express = require('express')
const { serialize } = require('v8')
const app = express()

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

app.get('/api/notes', (req,res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (req,res) => {
    const id = Number(req.params.id)
    const note = notes.find(n => n.id === id)
    if(note) {
        res.json(note)
    }
    else {
        res.status(404).end()
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})