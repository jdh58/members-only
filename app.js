const express = require('express');
const path = require('path');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const User = require('./models/User');

const app = express();

const mongoURI = process.env.MONGOURI;
async function main() {
  await mongoose.connect(mongoURI);
}
main().catch((err) => console.error(err));

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = User.find({ name: username }).exec();

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    } catch (err) {
      console.error(err);
    }
  })
);

app.post(
  'log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
  })
);

app.use(session({ secret: 'member', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session);

app.use('/', (req, res, next) => {
  res.render('index', { title: 'test' });
});

const port = process.env.PORT || 3000;
app.listen(port);
