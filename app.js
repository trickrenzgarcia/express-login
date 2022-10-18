const express = require('express')
const app = express()
const PORT = 5000
const { uuid } = require('uuidv4')
const { hash, compare } = require('bcrypt')
const db = require('./database')
const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
  origin: '*'
}
))


app.get('/', (req, res) => {
  res.send("hello")
})

app.get('/users', (req, res) => {
  db.query(`SELECT * FROM users`, (err, results) => {
    if (err) {
      res.send({message: err})
    }

    res.status(200).send(results)
  })
})

app.post('/register', (req, res) => {
  const uid = uuid()
  const { username, email, password } = req.body
  hash(password, 10, (err, hashed) => {
    db.query(`INSERT INTO users (uid, username, email, password) VALUES ('${uid}', '${username}', '${email}', '${hashed}')`, (err, result) => {
      if (err) throw err;
      console.log("1 user successfully added!")
    })
  })
  res.send("done")
})

app.post('/login', (req, res) => {
  const { email } = req.body;
  const pass = req.body.password;
  db.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
    var qPass = result[0].password
    var qEmail = result[0].email
    var qUser = result[0].username
    var qUid = result[0].uid
    compare(pass, qPass, (error, result) => {
      if(result) {
        res.send({
          loginStatus: result,
          uid: qUid,
          email: qEmail,
          username: qUser,
          password: qPass
        })
      }
      else res.send("wrong password")
    })
  })
  
})

app.listen(PORT, () => {
  console.log(`the server is ready at http://localhost:${PORT}`)
})