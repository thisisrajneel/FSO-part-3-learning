const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

// supertest wraps app into a superagent object
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
})

describe('when there is initially some notes saved', () => {
    test('notes are returned as JSON', async () => {
        await api
                .get('/api/notes')
                .expect(200)
                .expect('Content-Type', /application\/json/)
    }, 100000)
    
    test('all notes are returned', async () => {
        const response = await api.get('/api/notes')
    
        expect(response.body).toHaveLength(helper.initialNotes.length)
    })
    
    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes')
    
        const contents = response.body.map(r => r.content)
        expect(contents).toContain('Browser can execute only Javascript')
    })
})

describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
        const notesAtStart = await helper.notesInDB()
        const noteToView = notesAtStart[0]
    
        const resultNote = await api
                                    .get(`/api/notes/${noteToView.id}`)
                                    .expect(200)
                                    .expect('Content-Type', /application\/json/)
        
        // resultNote is coming from api request, which serializes data into JSON in the route handler itself.
        // noteToView is coming directly from DB, which does note convert the date from type Date to String, hence it needs to be processed.
        const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
    
        expect(resultNote.body).toEqual(processedNoteToView)
    })
})

describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true
        }
    
        await api
                .post('/api/notes')
                .send(newNote)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        const notesAtEnd = await helper.notesInDB()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
    
        const contents = notesAtEnd.map(r => r.content)
        expect(contents).toContain('async/await simplifies making async calls')
    })
    
    test('fails with status code 400 if data invalid', async () => {
        const newNote = {
            important: true
        }
    
        await api
                .post('/api/notes')
                .send(newNote)
                .expect(400)
        
        const notesAtEnd = await helper.notesInDB()
    
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    })
})

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const notesAtStart = await helper.notesInDB()
        const noteToDelete = notesAtStart[0]
      
        await api
          .delete(`/api/notes/${noteToDelete.id}`)
          .expect(204)
      
        const notesAtEnd = await helper.notesInDB()
      
        expect(notesAtEnd).toHaveLength(
          helper.initialNotes.length - 1
        )
      
        const contents = notesAtEnd.map(r => r.content)
      
        expect(contents).not.toContain(noteToDelete.content)
    })
})

afterAll(() => {
    mongoose.connection.close()
})