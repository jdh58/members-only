const express = require('express');
const route = express.Router();

// Get users index

route.get('/', userController.getIndex);

// Get user details page
route.get('/:id', userController.getDetails);

// Get log in form
route.get('/log-in', userController.getLogIn);

// Post log in form
route.post('/log-in', userController.postLogIn);

// Get sign up form
route.get('/sign-up', userController.getSignUp);

// Post sign up form
route.post('/sign-up', userController.postSignUp);

// Get member signup page
route.get('/member', userController.getMember);

// Post member signup page
route.post('/member', userController.postMember);

module.exports = route;
