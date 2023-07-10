const express = require('express')
const session = require('express-session')
const MSQLStore = require('express-mysql-session')(session)
const mysql = require('mysql2')
const path = require('path')

const app = express()
const port = 8080


const db = mysql.createConnection({
  host: 'db',
  user: 'proj_user',
  password: 'password',
  database: 'proj_db',
  port: 3306
})

const sessionStore = new MSQLStore({
  host: 'db',
  user: 'proj_user',
  password: 'password',
  database: 'session_store',
  createDatabaseTable: true,
  port: 3306
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'static')))

app.set('views', __dirname + '/views')
//app.engine('.html', require('ejs').__express)
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  if (req.session.uid) {
    res.redirect('/feed')
  } else {
    res.redirect('/login')
  }
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'))
})

app.post('/register', (req,res) => {
  const {email, username, password} = req.body

  db.query('SELECT uid FROM User WHERE email = ? OR username = ?', [email, username], (error, conflicts) => {
    if (error) throw error

    if (conflicts.length > 0) {
      res.send('Username or Email Taken!')
    } else {
      db.query('INSERT INTO User (email, username, password) VALUES (?, ?, MD5(?))', [email, username, password], (error, insertion) => {
        if (error) throw error

        db.query('SELECT uid FROM User WHERE email = ? AND username = ? AND password = MD5(?)', [email, username, password], (error, results) => {
          if (req.session.uid)
            req.session.regenerate((error) => {
              if (error) throw error

              req.session.uid = results[0].uid
              req.session.username = username
              res.redirect('/feed')
            })
          else {
            req.session.uid = results[0].uid
            req.session.username = username
            res.redirect('/feed')
          }
        })
      })
    }
  })
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'))
})

app.post('/login', (req, res) => {
  const { username, password } = req.body

  db.query('SELECT uid, email, username FROM User WHERE username = ? AND password = MD5(?)', [username, password], (error, results) => {
    if (error) throw error

    if (results.length == 0) {
      if (req.session) {
        if (req.session.uid)
          res.redirect('/login')
        else
          req.session.destroy(() => {
            res.redirect('/login')
          })
      }
    } else {
      user = results[0]
      req.session.regenerate(function (error) {
        if (error) throw error

        req.session.uid = user.uid
        req.session.username = user.username
        res.redirect('/feed')
      })
    }
  })
})

app.get('/feed', (req, res) => {
  if (req.session.uid) {
    db.query('SELECT username FROM User WHERE uid = ?', [req.session.uid], (error, user) => {
      if (error) throw error
      if (user.length == 0)
        req.session.destroy(() => {
          res.send('User no longer exists!')
        })
      else {
        var interval_days = 1;
        db.query('SELECT title, text_content, image_content, belongs_in, u.username AS username FROM Post JOIN Follows f ON belongs_in = f.followed_community LEFT JOIN Reviews R ON Post.pid = R.pid AND R.review = 1 JOIN User u ON u.uid = publisher WHERE f.follower = ? AND post_date >= DATE_SUB(NOW(), INTERVAL ? DAY) GROUP BY Post.pid ORDER BY COUNT(R.review);', [req.session.uid, interval_days], (error, posts) => {
          if (error) throw error
          db.query('SELECT followed_community AS name FROM Follows WHERE follower = ?', [req.session.uid], (error, my_communities) => {
            if (error) throw error
            res.render('feed', {username: req.session.username, posts: posts, my_communities: my_communities})
          })
    });
      }
    })
    
  } else {
    res.redirect('/login')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})