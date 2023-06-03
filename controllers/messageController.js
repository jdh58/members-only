const express = require('express');
const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const { body, validationResult } = require('express-validator');
const { findByIdAndRemove } = require('../models/User');

exports.getIndex = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().populate('user').exec();

  res.render('messageIndex', {
    title: 'All Messages',
    messages,
  });
});

exports.getDetails = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate('user').exec();

  res.render('messageDetails', {
    title: 'Message Details',
    message,
    user: message.user,
  });
});

exports.getCreate = (req, res, next) => {
  res.render('createMessageForm', { title: 'Create a new message' });
};

exports.postCreate = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Your message title must be between 3 and 50 characters.')
    .isAlphanumeric()
    .withMessage(
      'Your message title contains non-alphanumeric (A-z 0-9) characters'
    )
    .escape(),
  body('text')
    .trim()
    .isLength({ min: 1, max: 560 })
    .withMessage('Your message text must be between 1 and 560 characters.')
    .isAlphanumeric()
    .withMessage(
      'Your message text contains non-alphanumeric (A-z 0-9) characters'
    )
    .escape(),
  asyncHandler(async (req, res, next) => {
    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      timestamp: new Date(),
      user: req.user.id,
    });

    const errors = validationResult(req);

    if (!req.user) {
      // If the user does not exist (not logged in), re-render the form with that error.
      res.render('createMessageForm', {
        title: 'Create a new message',
        errors: [{ msg: 'You must log in to create a new message.' }],
      });
    }
    if (!errors.isEmpty()) {
      // There were validation errors. re-render the form with these errors.
      res.render('createMessageForm', {
        title: 'Create a new message',
        errors: errors.errors,
      });
    }
    // There were no errors, add this message to the database.
    await message.save();
    res.redirect('/messages');
  }),
];

exports.getDelete = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();

  if (req.user.admin === false) {
    // If the logged in user is not an admin, do not allow them to see this page.
    res.render('messageDetails', { title: 'Message Details', message });
  }

  res.render('messageDelete', { title: 'Delete a message', message });
});

exports.postDelete = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();

  if (req.user.admin === false) {
    // If the logged in user is not an admin, do not allow them to delete this message.
    // This is redundant, but a safeguard in case they somehow make a post request to this URL
    res.render('messageDetails', { title: 'Message Details', message });
  }

  // Otherwise, let them delete the message and redirect to the message index
  await Message.findByIdAndRemove(req.params.id);
  res.redirect('/messages');
});
