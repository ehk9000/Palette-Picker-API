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
    if (!palette) return res.status(404).json({ error: `Can't find palette with id ${id}` })
    res.status(200).json(palette);
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

  let requiredFormat = ['palette_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']

  // console.log('endPo palette', palette);
  for (let requiredParameter of requiredFormat) {
    if (!palette[requiredParameter]) {
      return res.status(422).send({ 
        error: `Expected format: palette_name: <String>, color_1:<String>,
        color_2:<String>, color_3:<String>, color_4:<String>, color_5:<String>.
        You are missing "${requiredParameter}" property`})
    }
  }

  // make sure the project ID corresponds with the palette
  // If no project, create project w/ default values
  // else use project id as project_id (foreign key)
  // !! REMEMBER to add palette_name to table

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
  const project = await database('projects').where('id', id)

  if (!project.length){ return res.status(404).json({ error: `Can't find project with id ${id}` }) }

  try {
    await database('palettes').where('project_id', id).delete()
    await database('projects').where('id', id).delete()
    res.status(200).json(`Project with id of ${id} was successfully deleted`)
  }
  catch(error) {
    res.status(500).json({ error })
  }
})

app.delete('/api/v1/palettes/:id', async (req, res) => {
  const id = req.params.id;
  const palette = await database('palettes').where('id', id)

  if (!palette.length) return res.status(404).json({ error: `Can't find palette with id ${id}` })

  try {
    await database('palettes').where('id', id).delete()
    res.status(200).json(`Palette with id of ${id} was successfully deleted`)
  }
  catch(error) {
    res.status(500).json({ error })
  }
})

module.exports = app;
