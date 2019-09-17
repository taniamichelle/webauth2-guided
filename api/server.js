// middleware
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

// routers
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const db = require('../database/dbConfig.js');
const Users = require('../users/users-model');
const restricted = require('../auth/restricted-middleware');
const dbConnection = require('../database/dbConfig')

const server = express();

const sessionConfig = {
  name: 'orly',
  secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe',
  cookie: {
    maxAge: 1000 * 60 * 60, // this means the cookie is good for 1 hour
    secure: false, // true means only send cookie over https; bring from env. (set to true in production)
    httpOnly: true, // true means js has no access to cookie (can't manipulate cookie w/ js)
  },
  resave: false, // if no changes, keep the cookie the same
  saveUninitialized: true, // GDPR compliance
  store: new KnexSessionStore({
    knex: dbConnection, // save session to database
    tablename: 'knexsessions', // creating a table. name defaults to 'sessions' 
    sidfieldname: 'sessionid', // defaults to 'sid'
    createtable: true,
    clearInterval: 1000 * 60 * 30, // clean out expired session data
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
