const express = require('express');
const path = require('path');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/User');
const messageRouter = require('./routes/messageRouter');
const userRouter = require('./routes/userRouter');

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

app.use(session({ secret: 'member', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session);

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', (req, res, next) => {
  res.render('index', { title: 'test' });
});

app.use('/users', userRouter);
app.use('/messages', messageRouter);

const port = process.env.PORT || 3000;
app.listen(port);
