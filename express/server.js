'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

// const mysql = require('serverless-mysql');

const router = express.Router();


const mysql = require('serverless-mysql')({
  config: {
    host: "remotemysql.com",
    user: "YlO55imx4W",
    password: "xe5gPs4pNo",
    database: "YlO55imx4W"
  }
});

async function query(sql){
  return await mysql.query(sql)
  .then(res=>{
    console.log("DONE: " + res);
    return res
  })
  .catch(e => {
    console.log("ERR: " + e); // Error: Received packet in the wrong sequence
    throw e;
  });
  }
// <---------------- Routes START ---------------->

router.get('/', (req, res) => {
  // res.writeHead(400, { 'Content-Type': 'text/html' });
  res.write('<h1>Barsbaatar Testing!</h1>');
  res.end();
});

router.get('/users', async (req, res) => {
  let sql = `SELECT * FROM users`;
  try{
    res.send(await mysql.query(sql))
  }catch(err){
    console.log(err)
  }
});

// <---------------- Routes END ---------------->

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
