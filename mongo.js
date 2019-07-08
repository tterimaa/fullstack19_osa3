const mongoose = require('mongoose')

if ( process.argv.length > 6 ) {
  console.log('too many arguments')
  process.exit(1)
}

if ( process.argv.length === 4 ) {
  console.log('give number as third argument')
  process.exit(1)
}

if ( process.argv.length < 3 ) {
  console.log('give password as argument')
  process.exit(1)
}

let addFlag = (process.argv.length === 5)
console.log(addFlag)

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@test-us0aa.mongodb.net/puhelinluettelo?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
  id: Number
})

const Person = mongoose.model('Person', personSchema)

if(addFlag) {
  const name = process.argv[3]
  const number = process.argv[4]
  const newPerson = new Person({
    name: name,
    number: number,
    id: Math.floor(Math.random() * 100000)
  })
  newPerson.save().then(response => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  })
} else if ( process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}