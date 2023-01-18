const express = require('express');

const AuthService = require('./services/auth');

const router = express.Router();

/* Get an auth token */
router.get('/', async (req, res) => {
  const token = AuthService.getToken();

  console.log('token: ', token)

  res.send(token);
});

module.exports = router;
