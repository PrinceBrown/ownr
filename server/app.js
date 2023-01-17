require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const colors = require('colors');

// const expressWinston = require('express-winston');
const path = require('path');
const cookieParser = require('cookie-parser');
const apiSchema = require('./api/schema');

const authRouter = require('./routes/auth');
const { pool, checkTableExists, createTables } = require('./config/db');

const createApp = (logger) => {
  app.use(cors());

  console.log('Process.ENV...'.yellow, process.env.NODE_ENV);

  app.use(async (req, res, next) => {
    try {
      req.pool = pool;
      const client = await pool.connect();
      if (!await checkTableExists(client, 'animal_categories')) {
        await createTables();
      } else {
        console.log('Tables already exist');
      }
      client.release();
      next();
    } catch (error) {
      console.log(error);
      res.status(500).send('Error creating tables');
    }
  });

  // app.use(expressWinston.logger({ winstonInstance: logger }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // TODO: Serve your React App using the express server
  const buildPath = path.normalize(path.join(__dirname, './client/build'));
  app.use(express.static(buildPath));

  app.use('/auth', authRouter);

  app.use(
    '/graphql',
    graphqlHTTP({
      schema: apiSchema,
      graphiql: process.env.NODE_ENV === 'development',
    }),
  );

  // app.get('/', (req, res) => {
  //   pool.query('SELECT * FROM animal_categories', (err, result) => {
  //     if (!err) {
  //       res.json({ animal_categories: result.rows });
  //     } else {
  //       console.log({ err });
  //     }
  //   });
  // });
  // app.get('/photos', (req, res) => {
  //   pool.query('SELECT * FROM animal_photos', (err, result) => {
  //     if (!err) {
  //       res.json({ animal_categories: result.rows });
  //     } else {
  //       console.log({ err });
  //     }
  //   });
  // });

  // catch 404 and forward to error handler
  app.use((req, res) => {
    res.status(404).send('Not found');
  });

  // error handler
  app.use((err, req, res) => {
    res.status(err.status || 500);
  });

 

  return app;
};

module.exports = createApp;
