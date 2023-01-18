const express = require('express');

const router = express.Router();
const { pool } = require('../config/db');

router.get('/all-categories', (req, res) => {
  pool.query('SELECT * FROM animal_categories', (err, result) => {
    if (!err) {
      res.json({ animal_categories: result.rows });
    } else {
      console.log({ err });
    }
  });
});

router.get('/animals-categories/:category_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animal_photos WHERE category_id = $1', [req.params.category_id]);
    return res.json({ animalsByCategory: result.rows });
  } catch (error) {
    throw new Error('Error fetching animal categories from the database', error); // return an empty array as a default value
  }
});

router.get('/animal-photos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animal_photos');
    return res.json({ animalsPhotos: result.rows });
  } catch (error) {
    throw new Error('Error fetching animal categories from the database', error); // return an empty array as a default value
  }
});

 

module.exports = router;
