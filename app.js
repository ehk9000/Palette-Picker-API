const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/v1/projects', async (req, res) => {
  try {
    const projects = await database('projects').select()
      res.status(200).json(projects);
  }
  catch (error) {
    res.status(500).json({ error });
  }
});

app.get('/api/v1/projects/:id', async (req, res) => {
  try {
    const project = database('projects').where('id', req.params.id).first()
    res.status(200).json(project)
  }
  catch (error) {
    res.status(500).json({ error })
  }
})

app.post('/api/v1/projects', (req, res) => {
  const {name} = req.body
  if(!name) return res.status(422).json('Please name your project');
  database('projects').insert({name}, 'id')
  .then(id => {
    res.status(201).json({name, id: id[0]});
  })
  .catch(error => {
    res.status(500).json({ error });
  })
});

module.exports = app;
