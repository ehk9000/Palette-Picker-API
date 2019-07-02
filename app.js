const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/v1/projects', (req, res) => {
  return res.status(200).json('test');
});

// app.post('/api/v1/projects', (req, res) => {});

module.exports = app;
