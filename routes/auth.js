const express = require('express');
const passport = require('passport');
const router = express.Router();

// MongoDB Models
const User = require("../models/user.js");

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect(303, '/login.html?status=out');
  });
});

// local (username/password)
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login.html?status=fail',
    failureMessage: true,
    successRedirect: '/'
  }),
  (req, res, err) => {
    if (err) { return next(err); }
  }
)

router.post('/register', (req, res) => {
  // Password confirmation
  if (req.body.password !== req.body.password_conf) {
    err = "passwords must match"
    res.redirect(303, `/register.html?status=fail&err=${encodeURIComponent(err)}`);
  }

  // Email validation
  email_format = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!req.body.email.match(email_format)) {
    err = "email must be valid"
    res.redirect(303, `/register.html?status=fail&err=${encodeURIComponent(err)}`);
  }

  User.register(
    new User({ 
      email: req.body.email, 
      username: req.body.username 
    }), req.body.password, (err, msg) => {
      if (err) {
        res.redirect(303, `/register.html?status=fail&err=${encodeURIComponent(err)}`);
      } else {
        res.redirect(303, '/login.html?status=success');
      }
    }
  )
})

// Github Auth
router.get(
  '/github',
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

router.get(
  '/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login.html?status=fail&err=github' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

module.exports = router;