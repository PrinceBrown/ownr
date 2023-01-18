const express = require('express');

const router = express.Router();
const { pool } = require('../config/db');

// router.get('/all-categories', (req, res) => {
//   pool.query('SELECT * FROM animal_categories', (err, result) => {
//     if (!err) {
//       res.json({ animal_categories: result.rows });
//     } else {
//       console.log({ err });
//     }
//   });
// });

// router.get('/animals-categories/:category_id', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM animal_photos WHERE category_id = $1', [req.params.category_id]);
//     return res.json({ animalsByCategory: result.rows });
//   } catch (error) {
//     throw new Error('Error fetching animal categories from the database', error); // return an empty array as a default value
//   }
// });

router.get('/animal-photos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animal_photos');
    return res.json({ animalsPhotos: result.rows });
  } catch (error) {
    throw new Error('Error fetching animal categories from the database', error); // return an empty array as a default value
  }
});

router.post('/create-category', async (req, res) => {
  try {
    const result = await pool.query('INSERT INTO animal_categories (category) VALUES ($1) RETURNING *', [req.body.category]);
    return res.json({ categoryCreated: result.rows[0] });
  } catch (error) {
    throw new Error('Error fetching animal categories from the database', error); // return an empty array as a default value
  }
});

router.post('/add-photos', async (req, res) => {
  try {
    const result = await pool.query('INSERT INTO animal_photos (category_id, photo_url) VALUES ($1, $2) RETURNING *', [req.body.category_id, req.body.photo_url]);
    return res.json({ animalPhotos: result.rows[0] });
  } catch (error) {
    throw new Error('Error fetching animal categories from the database'); // return an empty array as a default value
  }
});

module.exports = router;
