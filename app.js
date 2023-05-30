const express = require('express');
const path = require('path');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();

const mongoURI = process.env.MONGOURI;
async function main() {
  await mongoose.connect(mongoURI);
}
main().catch((err) => console.error(err));

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');

app.use(session({ secret: 'member', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session);

app.use('/', (req, res, next) => {
  res.render('index', { title: 'test' });
});

const port = process.env.PORT || 3000;
app.listen(port);
