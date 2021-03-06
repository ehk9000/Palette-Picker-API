const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/api/v1/projects/', async (req, res) => {
  var name = req.query.name;
  let projects;
  if (name) {
    projects = await database('projects').where('name', 'like', `${name}%`)
  } else {
    projects = await database('projects').select()
  }
  try {
    if (!projects.length) return res.status(404).json({ error: `Can't find project any projects starting with ${name}`})
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
  const { name } = req.body;
  const duplicated = await database('projects').where('name', name).first();

  if (!name) return res.status(422).json({ error: 'Please name your project' });
  if (duplicated) return res.status(422).json({ error: `Project name with ${name} already exists. Please provide a unique name` });
  
  try {    
    const id = await database('projects').insert({ name }, 'id');
    res.status(201).json({ name, id: id[0] });
  }
  catch(error) {
    res.status(500).json({ error });
  }
});

app.post('/api/v1/palettes/', async (req, res) => {
  const palette = req.body;
  const duplicated = await database('palettes').where('name', palette.name).first();
  const requiredFormat = ['name', 'project_id','color_1', 'color_2', 'color_3', 'color_4', 'color_5']

  if (duplicated) return res.status(422).json({ error: `Palette name of ${duplicated.name} already exists. Please provide a unique name`})

  for (let requiredParameter of requiredFormat) {
    if (!palette[requiredParameter]) {
      return res.status(422).send({ 
        error: `Expected format: palette_name: <String>, project_id: <String>, color_1:<String>,
        color_2:<String>, color_3:<String>, color_4:<String>, color_5:<String>.
        You are missing ${requiredParameter} property`})
    }
  }

  try {
    const id = await database('palettes').insert(palette, 'id');
    res.status(201).json({...palette, id: id[0] })
  }
  catch(error) {
    res.status(500).json({ error })
  }
})

app.put('/api/v1/projects/:id', async (req, res) => {
  const id = req.params.id
  const project = await database('projects').where('id', id)
  const newProject = req.body

  if (!project.length) {
    return res.status(404).json({ error: `Can't find project with id ${id}`})
  }

  if (!newProject.name) {
    return res.status(422).send({
      error: 'Expected format: name: <String>. You must provide a project name'
    });
  }

  try {
    await database('projects').where('id', id).update(newProject)
    res.status(201).json(newProject)
  }

  catch(error) {
    res.status(500).json({ error })
  }
});

app.put('/api/v1/palettes/:id', async (req, res) => {
  const id = req.params.id
  const palette = await database('palettes').where('id', id)
  const newPalette = req.body
  let requiredFormat = ['name', 'project_id', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']

  if (!palette.length) {
    return res.status(404).json({ error: `Can't find palette with id ${id}`})
  }

  for (let requiredParameter of requiredFormat) {
    if (!newPalette[requiredParameter]) {
      return res.status(422).send({
        error: `Expected format: name: <String>, color_1:<String>,
        color_2:<String>, color_3:<String>, color_4:<String>, color_5:<String>.
        You are missing ${requiredParameter} property`
      })
    }
  }

  try {
    await database('palettes').where('id', id).update(newPalette)
    res.status(201).json(newPalette)
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
