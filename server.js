const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'suikoden'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`)
    db = client.db(dbName)
  }
)

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (request, response) => {
  const todoItems = await db.collection('suikoden').find().toArray()
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false })
  response.render('index.ejs', { items: todoItems, left: itemsLeft })
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
})

// app.post('/addTodo', (request, response) => {
//   db.collection('todos')
//     .insertOne({ thing: request.body.todoItem, completed: false })
//     .then((result) => {
//       console.log('Todo Added')
//       response.redirect('/')
//     })
//     .catch((error) => console.error(error))
// })

app.put('/markComplete', (request, response) => {
  db.collection('suikoden')
    .updateOne(
      { name: request.body.itemFromJS },
      {
        $set: {
          recruited: true
        }
      },
      {
        sort: { _id: -1 },
        upsert: false
      }
    )
    .then((result) => {
      console.log('Marked Complete')
      response.json('Marked Complete')
    })
    .catch((error) => console.error(error))
})

app.put('/markUnComplete', (request, response) => {
  db.collection('suikoden')
    .updateOne(
      { name: request.body.itemFromJS },
      {
        $set: {
          recruited: false
        }
      },
      {
        sort: { _id: -1 },
        upsert: false
      }
    )
    .then((result) => {
      console.log('Marked Complete')
      response.json('Marked Complete')
    })
    .catch((error) => console.error(error))
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
