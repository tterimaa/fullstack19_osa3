const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
morgan.token('pb', (req, res) => {
    if(req.method === 'POST') return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :pb'))

let persons = [
    {
        id: 1,
        nimi: "Arto Hellas",
        numero: 123456
    },
    {
        id: 2,
        nimi: "Aku Ankka",
        numero: 56789
    }
]

const generateId = () => {
    const number = Math.floor(Math.random() * 100000)
    console.log(number)
    return number
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.nimi || !body.numero) {
        return res.status(404).json({
            error: 'nimi tai numero puuttuu'
        })
    }

    if(persons.map(p => p.nimi).includes(body.nimi)) {
        return res.status(404).json({
            error: 'nimi on jo luettelossa'
        })
    }

    const person = {
        id: generateId(),
        nimi: body.nimi,
        numero: body.numero
    }

    res.json(person)

    persons = persons.concat(person)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date}`)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})