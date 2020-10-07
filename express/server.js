'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const mysql = require('mysql');
const db = mysql.createConnection({
  host: "remotemysql.com",
  user: "YlO55imx4W",
  password: "xe5gPs4pNo",
  database: "YlO55imx4W"
});

const router = express.Router();

// <---------------- Routes START ---------------->

router.get('/', (req, res) => {
  res.writeHead(400, { 'Content-Type': 'text/html' });
  res.write('<h1>Barsbaatar Testing!</h1>');
  res.end();
});

router.get('/users', (req, res) => {
  db.connect((err) => {
    if (err) { console.log('Error connected to database' + err); }
    console.log('Connected to database');
  });
  global.db = db;

  let query = `SELECT * FROM users`;
  db.query(query, (err, result) => {
    if (err) { res.redirect('/'); }

    res.json({result})
  })
});

router.get('/users/:id?', (req, res) => {
  db.connect((err) => {
    if (err) { console.log('Error connected to database' + err); }
    console.log('Connected to database');
  });
  global.db = db;
  let query = `SELECT * FROM users WHERE id = ${req.params.id}`;
  db.query(query, (err, result) => {
    if (err) { res.redirect('/'); }
    res.json(result[0])
  })
})

router.post('/signup', (req, res) => {
  let query = `INSERT INTO users (username, password, age, type) VALUES ('${req.body.username}', '${req.body.password}', '${req.body.age}', '${req.body.type}');`;
  // res.send(query)
  db.query(query, (err, result) => {
    if (err) { res.redirect('/'); }
    res.send(result)
  })
})

// <---------------- Routes END ---------------->

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
