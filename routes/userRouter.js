const express = require('express');
const route = express.Router();

const userController = require('../controllers/userController');

// Get users index

route.get('/', userController.getIndex);

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

// Get log out page
route.get('/log-out', userController.getLogOut);

// Get user details page
route.get('/:id', userController.getDetails);

module.exports = route;
