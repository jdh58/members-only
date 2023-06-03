const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Message = require('../models/Message');
require('dotenv');

const passport = require('passport');
const bcrypt = require('bcryptjs');

const { body, validationResult } = require('express-validator');

exports.getIndex = asyncHandler(async (req, res, next) => {
  const users = await User.find().exec();

  res.render('userIndex', { title: 'All Users', users });
});

exports.getDetails = asyncHandler(async (req, res, next) => {
  const [user, messages] = await Promise.all([
    await User.findById(req.params.id).exec(),
    await Message.find({ user: req.params.id }).exec(),
  ]);

  res.render('userDetails', { title: `Details Page`, user, messages });
});

exports.getLogIn = (req, res, next) => {
  res.render('logInForm', { title: 'Log in' });
};

exports.postLogIn = passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/users/log-in',
});

exports.getSignUp = (req, res, next) => {
  res.render('signUpForm', { title: 'Sign up' });
};

exports.postSignUp = [
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Your last name must be between 2 and 50 characters long.')
    .isAlphanumeric()
    .withMessage(
      'Your first name contains non-Alphanumeric (A-Z, 0-9) character.'
    )
    .escape(),
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Your last name must be between 2 and 50 characters long.')
    .isAlphanumeric()
    .withMessage(
      'Your first name contains non-Alphanumeric (A-Z, 0-9) character.'
    )
    .escape(),
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Your username must be between 3 and 50 characters long.')
    .escape(),
  body('password')
    .isLength({ min: 8, max: 100 })
    .withMessage('Your password must be between 8 and 100 characters long.'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      member: false,
      admin: req.body.admin === 'on' ? true : false,
    });

    // Check if a user with this username already exists
    const existingUser = await User.find({
      username: req.body.username,
    }).exec();
    if (existingUser.length > 0) {
      res.render('signUpForm', {
        title: 'Sign up',
        user,
        errors: [{ msg: 'A user with this username already exists' }],
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        // There was an error hashing the password, throw it and let the asynchandlr deal with it
        throw new Error(err);
      }
      if (!errors.isEmpty()) {
        // There was invalid data submitted. Re-render form with errors
        res.render('signUpForm', {
          title: 'Sign up',
          user,
          errors: errors.errors,
        });
        return;
      }
      // No errors, save the user with the hashed password to the database
      user.password = hashedPassword;
      await user.save();
      res.redirect('/users/log-in');
    });
  }),
];

exports.getMember = (req, res, next) => {
  res.render('memberForm', { title: 'Member Sign-Up' });
};

exports.postMember = [
  body('memberPassword').trim().escape(),
  asyncHandler(async (req, res, next) => {
    if (req.body.memberPassword === process.env.MEMBER_PASSWORD) {
      // Update the user to set member to true
      await User.findByIdAndUpdate(req.user.id, { member: true });
      res.redirect('/');
    } else {
      // Otherwise, re-render the form with the error showing
      res.render('memberForm', {
        title: 'Member Sign-Up',
        error: 'Incorrect password',
      });
    }
  }),
];

exports.getLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect('/');
    }
  });
};
