const express = require('express')
const session = require('express-session')
const MSQLStore = require('express-mysql-session')(session)
//const mysql = require('mysql2')
const path = require('path')

const { promise_pool, checkCredentials, registerCheck, getUserId, getEmail, getUsername, getUserPosts, getUserFeed, getCommunityPosts, getCommunityDescription, getOwnedCommunities, getFollowedCommunities, getPopularCommunities, getAllCommunities, getUserGroups, getGroupMembers, getUserInbox, createUser, createPost, createGroup, composeMessage_User, joinGroup, followUC, changeEmail, changeUsername, changePassword, leaveGroup, deleteGroup, unfollowUC } = require('./queries.js');

const multer = require('multer');
const upload = multer();

const app = express()
const port = 8080

/*
const db = mysql.createConnection({
  host: 'db',
  user: 'proj_user',
  password: 'password',
  database: 'proj_db',
  port: 3306
})
*/

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
app.use(express.json())

app.use(express.static(path.join(__dirname, 'static')))

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.set('views', __dirname + '/views')
//app.engine('.html', require('ejs').__express)
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  if (req.session.uid) {
    res.redirect('/feed')
  } else {
    res.redirect('/login')
  }
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'))
});

app.post('/register', (req,res) => {
  const {email, username, password} = req.body;

  (async () => {
    try {
      const conflict = await registerCheck(email, username);
      if(conflict) {
        res.redirect('/register')
      } else {
        await createUser(email, username, password);
        const uid = await getUserId(username);
        if (req.session.uid)
            req.session.regenerate((error) => {
              if (error) throw error

              req.session.uid = uid
              req.session.username = username
              res.redirect('/feed')
            })
          else {
            req.session.uid = uid
            req.session.username = username
            res.redirect('/feed')
          }
      }
      
    } catch (error) {
      console.log(error)
      res.redirect('/');
    }
  })();
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'))
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  (async () => {
    try {
      const results = await checkCredentials(username, password)

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
    } catch (error) {
      console.log(error)
      res.redirect('/');
    }
  })();
});

app.get('/feed', (req, res) => {
  if (req.session.uid) {
    (async () => {
      try {
        const username = await getUsername(req.session.uid)
        if (username.length == 0 || username[0].username != req.session.username)
          req.session.destroy(() => {
            res.redirect('/')
          })
        else {
          const interval_days = 5;
          const feed = await getUserFeed(req.session.uid, interval_days)
          const followed_communities = await getFollowedCommunities(req.session.uid)
          const popular_communities = await getPopularCommunities(10)
          res.render('feed', {username: req.session.username, posts: feed, followed_communities: followed_communities, popular_communities: popular_communities})
        }
      } catch (error) {
        console.log(error)
        res.redirect('/');
      }
    })();
  } else {
    req.session.destroy(() => {
      res.redirect('/')
    })
  }
});

app.get('/new-post', (req, res) => {
  if(req.session && req.session.uid) {
    (async () => {
      try {
        const followed_communities = await getFollowedCommunities(req.session.uid)
        const popular_communities = await getPopularCommunities(10)
        const communities = await getAllCommunities()
        res.render('new-post', {username: req.session.username, communities: communities, followed_communities: followed_communities, popular_communities: popular_communities})
      } catch (error) {
        console.log(error)
        res.redirect('/');
      }
    })()
  } else if (req.session) {
    req.session.destroy(() => {
      res.redirect('/login')
    })
  } else
    res.redirect('/login')
});

app.post('/new-post', upload.single('image_content'), (req, res) => {
  const {title, text_content, belongs_in} = req.body

  if(req.session && req.session.uid) {
    console.log(req.file.buffer)
    console.log(`${req.body.title} : ${req.session.username} @ ${req.body.belongs_in}`)
    if(title && text_content && belongs_in) {
      (async () => {
        try {
          await createPost(title, text_content, ((req.file.buffer) ? req.file.buffer.toString('base64') : null), belongs_in, req.session.uid);
          res.redirect('/my-profile');
        } catch (error) {
          console.log(error);
          res.redirect('/');
        }
      })();
    }
  } else if (req.session) {
    req.session.destroy(() => {
      res.redirect('/login')
    })
  } else
    res.redirect('/login')
});

app.get('/my-profile', (req, res) => {
  if (req.session.uid) {
    (async () => {
      try {
        const email = await getEmail(req.session.uid);
        const posts = await getUserPosts(req.session.uid)
        const owned_communities = await getOwnedCommunities(req.session.uid)
        const followed_communities = await getFollowedCommunities(req.session.uid)
        const popular_communities = await getPopularCommunities(10)
        res.render('my-profile', {username: req.session.username, email: email, posts: posts, owned_communities: owned_communities, followed_communities: followed_communities, popular_communities: popular_communities})
      } catch (error) {
        console.log(error)
        res.redirect('/');
      }
    })();
  } else {
    res.redirect('/login')
  }
});

app.post('/change-user', function(req, res) {
  if (req.session && req.session.uid) {
    if (req.body.field && req.body.new_val && req.body.pass) {
      if (req.body.field == 'email') {
        (async () => {
          try {
            const conflict = await registerCheck(req.body.my_val, null);
            if (conflict)
              res.redirect('/my-profile')
            else
              await changeEmail(req.body.new_val, req.session.uid, req.body.pass);
          } catch (error) {
            console.log(error)
            res.redirect('/');
          }
        })();
      } else if (req.body.field == 'username') {
        (async () => {
          try {
            const conflict = await registerCheck(null, req.body.my_val);
            if (conflict)
              res.redirect('/my-profile');
            else {
              var results = await changeUsername(req.body.new_val, req.session.uid, req.body.pass);
              var uid = req.session.uid;
              req.session.regenerate((error) => {
                if (error) throw error;

                req.session.uid = uid;
                req.session.username = req.body.new_val;
                res.redirect('/feed');
              })
            }
          } catch (error) {
            console.log(error)
            res.redirect('/');
          }
        })();
      } else if (req.body.field == 'password') {
        (async () => {
          try {
              await changePassword(req.body.new_val, req.session.uid, req.body.pass);
          } catch (error) {
            console.log(error)
            res.redirect('/');
          }
        })();
      } else
        res.redirect('/my-profile')
    } else {
      res.redirect('/my-profile')
    }
  } else {
    res.redirect('/')
  }
  console.log(`${req.body.field} change to ${req.body.new_val}; pass: ${req.body.pass}`);
});

app.get('/groups', function(req, res) {
  if (req.session.uid) {
    (async () => {
      try {
        const username = await getUsername(req.session.uid)
        if (username.length == 0 || username[0].username != req.session.username)
          req.session.destroy(() => {
            res.redirect('/')
          })
        else {
          const user_groups = await getUserGroups(req.session.uid);
          const followed_communities = await getFollowedCommunities(req.session.uid);
          const popular_communities = await getPopularCommunities(10);
          var groups_members = [];

          if(user_groups.length > 0) {
            for(var g of user_groups) {
              var members = await getGroupMembers(g.gid);
              var m_arr = [];
              for(var m of members)
                m_arr.push(m.username);
              groups_members.push(m_arr);
            }
          }
          res.render('groups', {username: req.session.username, groups: user_groups, groups_m: groups_members, followed_communities: followed_communities, popular_communities: popular_communities});
        }
      } catch (error) {
        console.log(error)
        res.redirect('/');
      }
    })();
  } else {
    req.session.destroy(() => {
      res.redirect('/')
    })
  }
});

app.post('/create-group', function(req, res) {
  const {group_name} = req.body

  if(req.session && req.session.uid) {
    if(group_name) {
      (async () => {
        try {
          const gid = await createGroup(group_name);
          if (gid) {
            console.log(`New Group (${gid}): ${group_name} -> [ ${req.session.username} ]`)
            await joinGroup(gid, req.session.uid);
            res.redirect('/groups')
          } else
            res.redirect('/my-profile');
        } catch (error) {
          console.log(error);
          res.redirect('/');
        }
      })();
    }
  } else if (req.session) {
    req.session.destroy(() => {
      res.redirect('/login')
    })
  } else
    res.redirect('/login')
});

app.post('/join-group', function(req, res) {
  const {group_id} = req.body

  if(req.session && req.session.uid) {
    if(group_id) {
      (async () => {
        try {
          if (group_id) {
            await joinGroup(group_id, req.session.uid);
            res.redirect('/groups')
          } else
            res.redirect('/my-profile');
        } catch (error) {
          console.log(error);
          res.redirect('/');
        }
      })();
    }
  } else if (req.session) {
    req.session.destroy(() => {
      res.redirect('/login')
    })
  } else
    res.redirect('/login')
});

app.get('/leave-group', function (req, res) {
  const gid = req.query.gid;

  if (gid && req.session && req.session.uid) {
    (async () => {
      try {
        await leaveGroup(req.session.uid, gid);
        var members = await getGroupMembers(gid);
        if (members.length == 0)
          await deleteGroup(gid);
        res.redirect('/groups')
      } catch (error) {
        console.log(error);
        res.redirect('/');
      }
    })();
  } else {
    res.redirect('/')
  }
});

app.get('/messages', function (req, res) {
  if (req.session.uid) {
    (async () => {
      try {
        const username = await getUsername(req.session.uid)
        if (username.length == 0 || username[0].username != req.session.username)
          req.session.destroy(() => {
            res.redirect('/')
          })
        else {
          const inbox = await getUserInbox(req.session.uid);
          const followed_communities = await getFollowedCommunities(req.session.uid);
          const popular_communities = await getPopularCommunities(10);
          res.render('messages', {username: req.session.username, messages: inbox, followed_communities: followed_communities, popular_communities: popular_communities});
        }
      } catch (error) {
        console.log(error)
        res.redirect('/');
      }
    })();
  } else {
    req.session.destroy(() => {
      res.redirect('/')
    })
  }
});

app.post('/compose', function (req, res) {
  const { recipient, text_content } = req.body;

  if(req.session.uid) {
    (async () => {
      try {
        const uid = await getUserId(recipient)
        if (uid) {
          await composeMessage_User(req.session.uid, uid, text_content)
          res.redirect('/messages')
        }
      } catch (error) {
        console.log(error)
        res.redirect('/');
      }
    })();
  } else {
    res.redirection('')
  }

  console.log(`${recipient}: ${text_content}`);
});

app.get('/community', function (req, res) {
  const community = req.query.community;

  (async () => {
    try {
      const desc = await getCommunityDescription(community);
      if (desc) {
        const posts = await getCommunityPosts(community);
        const followed_communities = await getFollowedCommunities(req.session.uid);
        const popular_communities = await getPopularCommunities(10);
        res.render('community', {posts: posts, description: desc, name: community, followed_communities: followed_communities, popular_communities: popular_communities});
      } else {
        res.rediret('/');
      }
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  })();

});

app.post('/follow', function (req, res) {
  const { community, uid } = req.body;

  (async () => {
    try {
      if (req.session && req.session.uid) {
        await followUC(req.session.uid, null, community);
        if(community)
          res.redirect(`/community?community=${community}`);
        else
          res.send('Temp');
      } else {
        res.rediret('/');
      }
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  })();
});

app.post('/unfollow', function (req, res) {
  const { community, uid } = req.body;

  (async () => {
    try {
      if (req.session && req.session.uid) {
        await unfollowUC(req.session.uid, null, community);
        if(community)
          res.redirect(`/community?community=${community}`);
        else
          res.send('Temp');
      } else {
        res.rediret('/');
      }
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  })();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});