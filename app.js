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
  const id = req.params.id;
  try {
    const project = await database('projects').where('id', id).first()
    if (!project) return res.status(404).json(`Cant find project with id ${id}`)
    res.status(200).json(project)
  }
  catch (error) {
    res.status(500).json({ error })
  }
})

app.post('/api/v1/projects', async (req, res) => {
  const { name } = req.body
  try {
    if(!name) return res.status(422).json('Please name your project');
    const id = await database('projects').insert({name}, 'id')
    res.status(201).json({name, id: id[0]});
  }
  catch(error) {
    res.status(500).json({ error });
  }
});

module.exports = app;
