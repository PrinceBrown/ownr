/* eslint-disable func-names */
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');
const { pool } = require('../db');

// Load User Model
// const User = require('../model/User');
// Load UserTypes
// const accessTypes = require('../config/accessTypes');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      (email, password, done) => {
        // Match User

        pool.query('SELECT * FROM users WHERE email = $1', [email]).then((result) => {
          const user = result.rows[0];
          if (!user) {
            return done(null, false, {
              message: 'That email is not registered',
            });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, {
              message: 'Password or email is incorrect',
            })
              .catch((err) => {
                if (err) throw err;
              });
          });
        });
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // User.findById(id, (err, user) => {
  //   done(null, user);
  // });
  passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id]).then((result) => {
      const user = result.rows[0];
      done(null, user);
    });
  });
};
