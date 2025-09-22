require('dotenv').config() // Load .env
const crypto = require('node:crypto');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;

// Routers
const dataRouter = require('./routes/api/data.js')
const userRouter = require('./routes/api/user.js')
const authRouter = require('./routes/auth.js')

// MongoDB Models
const User = require("./models/user.js");

// Express App
const app = express();
const port = 3000;

// Database
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING);
const db = mongoose.connection;

// Session handling
app.use(session({
  secret: 'secrettexthere',
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false,            //setting this false for http connections
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000) 
  },
  store: new MongoStore({ 
    collection: 'sessions',
    mongoUrl: db.client.s.url
  })
}));
app.use(passport.authenticate('session'));

// User strategy
const strategy = User.createStrategy()
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// Github Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ githubId: profile.id, email: profile.emails[0].value,})
    .then((user) => {
      // console.log(user)
      if (!user) {
        User.register(
          new User({ 
            githubId: profile.id,
            email: profile.emails[0].value,
            username: profile.username 
          }), random_password(16), (err, newUser) => {
            console.log("err: "+err)
            console.log("new_usr:"+newUser)
            if (err) { return done(err) }
            else { return done(null, newUser) }
          }
        )
      } else {
        return done(null, user);
      }
    }).catch((e) => done(e))
  }
));

// Handle forms instead of JSON
app.use(express.urlencoded({ extended: true }))

// Static file middleware 
function enforce_files(req, res, next) {
  logged_out = [
    '/login.html',
    '/register.html',
    '/',
    '/index.html'
  ]
  logged_in = [
    '/portal.html',
  ]

  if (logged_out.includes(req.originalUrl)) {
    return enforce_logged_out(req, res, next)
  } else if (logged_in.includes(req.originalUrl)) {
    return enforce_logged_in(req, res, next)
  } else return next()
}

function enforce_logged_out(req, res, next) {
  if (req.isAuthenticated()) res.redirect(302, '/portal.html')
  else next()
}

function enforce_logged_in(req, res, next) {
  if (!req.isAuthenticated()) res.status(401).send("Unauthorized to access resource");
  else next()
}

// Serve static files in public/
static_file_folder = "public"
app.use(enforce_files, express.static(static_file_folder));

app.use('/api', enforce_logged_in, dataRouter)
app.use('/api', enforce_logged_in, userRouter)
app.use('/auth', authRouter)

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


function random_password(length) {
  let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % characters.length;
    password += characters[randomIndex];
  }
  return password;
}