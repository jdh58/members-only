const express = require('express');
const messageController = require('../controllers/messageController');

const route = express.Router();

// Get messages index page
route.get('/', messageController.getIndex);

// Get messages create form
route.get('/create', messageController.getCreate);

// Post message create form
route.get('/create', messageController.postCreate);

// Get message details page
route.get('/:id', messageController.getDetails);

// Get message delete form
route.get('/:id/delete', messageController.getDelete);

// Post message delete form
route.post('/:id/delete', messageController.postDelete);

module.exports = route;
