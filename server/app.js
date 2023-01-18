require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');

// const expressWinston = require('express-winston');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const flash = require('connect-flash');
const passport = require('passport');
require('./config/auth/passport')(passport);

const mainRoute = require('./routes/main');
const adminRoute = require('./routes/admin');

const authRouter = require('./routes/auth');
const { pool, checkTableExists, createTables } = require('./config/db');

const createApp = (logger) => {
  app.use(cors());

  // Passport Config
  // console.log('Process.ENV...'.yellow, process.env.NODE_ENV);

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
  // const buildPath = path.normalize(path.join(__dirname, './client/build'));
  // app.use(express.static(buildPath));

  // Connect Flash
  // app.use(flash());

  // global Vars
  // app.use((req, res, next) => {
  //   res.locals.passed_qualification_msg = req.flash('passed_qualification_msg');
  //   res.locals.email_exists_msg = req.flash('email_exists_msg');
  //   res.locals.user_error_found = req.flash('user_error_found');
  //   res.locals.success_msg = req.flash('success_msg');
  //   res.locals.error_msg = req.flash('error_msg');
  //   res.locals.error = req.flash('error');
  //   next();
  // });

  // Static Files
  app.use(express.static(path.join(__dirname, 'public')));
  // Accept Incoming Input Data
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  // Setup EJS View Engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'view'));
  // Log Incoming Req.
  // app.use(morgan('combined'))

  app.set('trust proxy', true);

  // app.use('/auth', authRouter);

  app.use('/api', mainRoute);

  app.use('/admin', adminRoute);

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
