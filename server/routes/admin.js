const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// PROTECTED ROUTES MIDDLEWARE-------------------------------
// Ensure is Authenticated Middleware
const { ensureAuthenticated } = require('../config/auth/admin-auth');
const { authenticate } = require('../config/auth/authWithJWT');

const SECRET_KEY = 'yoursecretkey';
const tokenCreator = (user) => jwt.sign({ user }, SECRET_KEY, { expiresIn: '1h' });

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
}

// Login Routes
router.get('/login', (req, res, next) => res
  .status(200)
  .render('admin/login', { title: 'Login To Manage Your Business' }));

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('hitting the backend email', email.trim());
  // Verify user's credentials

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim()]);
  console.log('result.rows[0]', result.rows);
  const user = result.rows[0];

  // Match password
  // bcrypt.compare(password, user.password, (err, isMatch) => {
  //   if (err) throw err;

  //   if (isMatch) {
  //     return done(null, user);
  //   }
  //   return done(null, false, {
  //     message: 'Password or email is incorrect',
  //   })
  //     .catch((err) => {
  //       if (err) throw err;
  //     });
  // });

  // Generate token

  res.json({ token: tokenCreator(user) });
});

// Sign up Route
router.get('/register', (req, res, next) => res
  .status(200)
  .render('admin/register', { title: 'Register To Manage Animals' }));

router.post('/register', async (req, res, next) => {
  // const { firstname, email, password } = req.body;

  // Sanitize Data
  const firstname = req.body.firstname.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  // Check if user exists
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim()]);
  const user = result.rows[0];

  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    // Hash password

    // generate random id
    const id = Math.floor(Math.random() * 1000000000);
    const result = await pool.query('INSERT INTO users(id, firstname, email, password) VALUES ($1, $2, $3, $4)', [id, firstname, email, password]);
    console.log('Successfully created Admin account', result);
    return res.status(301).redirect('/admin/login');
  } catch (error) {
    throw new Error('Error Saving User'); // return an empty array as a default value
  }
});

router.get('/logout', (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Access denied. No token provided.');

  jwt.invalidate(token, process.env.JWT_SECRET);
  return res.status(301).redirect('/admin/login');
});

// Passport Logout Handle
// router.get('/logout', ensureAuthenticated, (req, res, next) => {
//   req.logout();
//   // req.flash('success_msg', 'You are logged out');
//   res.status(301).redirect('/admin/login');
// });

// ----------------------------------------------------------------------------------

router.post('/create-category', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('INSERT INTO animal_categories (category) VALUES ($1) RETURNING *', [req.body.category]);
    return res.json({ categoryCreated: result.rows[0] });
  } catch (error) {
    throw new Error('Error fetching animal categories from the database', error); // return an empty array as a default value
  }
});

router.post('/add-photos', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('INSERT INTO animal_photos (category_id, photo_url) VALUES ($1, $2) RETURNING *', [req.body.category_id, req.body.photo_url]);
    return res.json({ animalPhotos: result.rows[0] });
  } catch (error) {
    throw new Error('Error fetching animal categories from the database'); // return an empty array as a default value
  }
});

module.exports = router;
