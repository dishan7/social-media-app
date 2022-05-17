const express = require('express');
const { postSignup, getConfirmation } = require('../controllers/signupController');
const router = express.Router();
const user = require('../models/user');

router.post('/signup' , postSignup);
router.get('/:confirmationCode' , getConfirmation);

module.exports = router