const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/api/v1/projects/', async (req, res) => {
  try {
    const projects = await database('projects').select()
      res.status(200).json(projects);
  }
  catch(error) {
    res.status(500).json({ error });
  }
});

app.get('/api/v1/projects/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const project = await database('projects').where('id', id).first()
    if (!project) return res.status(404).json({ error: `Can't find project with id ${id}` })
    res.status(200).json(project)
  }
  catch(error) {
    res.status(500).json({ error })
  }
})

app.get('/api/v1/palettes/', async (req, res) => {
  try {
    const palettes = await database('palettes').select()
    res.status(200).json(palettes);
  }
  catch(error) {
    res.status(500).json({ error })
  }
})

app.get('/api/v1/palettes/:id', async (req, res) => {
  const id = req.params.id
  try {
    const palette = await database('palettes').where('id', id).first()
    if (!palette) return res.status(404).json({ error: `Can't find project with id ${id}` })
  }
  catch(error) {
    res.status(500).json({ error })
  }
})


app.post('/api/v1/projects/', async (req, res) => {
  const { name } = req.body
  try {
    if(!name) return res.status(422).json('Please name your project');
    const id = await database('projects').insert({ name }, 'id')
    res.status(201).json({ name, id: id[0] });
  }
  catch(error) {
    res.status(500).json({ error });
  }
});

app.post('/api/v1/palettes/', async (req, res) => {
  const palette = req.body;

  let newPalette = {
    color_1: palette.color_1,
    color_2: palette.color_2,
    color_3: palette.color_3,
    color_4: palette.color_4,
    color_5: palette.color_5
  }
  for (let requiredParameter of ['project_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']) {
    if (!palette[requiredParameter]) {
      return res.status(422).send({ 
        error: `Expected format: project_name: <String>, color_1:<String>,
        color_2:<String>, color_3:<String>, color_4:<String>, color_5:<String>.
        You are missing "${requiredParameter}" property`})
    }
  }

  try {
    const projectId = await database('projects').where({name: palette.project_name}).select('id')
    const finishedPalette = await database('palettes').insert({...newPalette, project_id: projectId[0].id}, 'id');
    res.status(201).json({ id: finishedPalette[0]})
  }
  catch(error) {
    res.status(500).json({ error })
  }
})

app.delete('/api/v1/projects/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const project = await database('projects').where('id', id).delete()
    if (!project) return res.status(404).json({ error: `Can't find project with id ${id}` })
    res.status(200).json(`Project with id of ${id} was successfully deleted`)
  }
  catch(error) {
    res.status(500).json({ error })
  }
})

app.delete('/api/v1/palettes/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const palette = await database('projects').where('id', id).delete()
    if (!palette) return res.status(404).json({ error: `Can't find project with id ${id}` })
    res.status(200).json(`Project with id of ${id} was successfully deleted`)
  }
  catch(error) {
    res.status(500).json({ error })
  }
})

module.exports = app;
