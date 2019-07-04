const request = require('supertest')
const app = require('./app')
const environment = process.env.NODE_ENV || 'test'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)


describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run
  })
  describe('GET Methods for Palettes & Projects', () => {
    describe('GET /projects && /palettes', () => {
      it('should return all the projects in the DB ', async () => {
        // set up 
        const expectedProjects = await database('projects').select()
        expectedProjects.forEach(project => {
          project.created_at = project.created_at.toJSON()
          project.updated_at = project.updated_at.toJSON()
        })
  
        //  execution
        const response = await request(app).get('/api/v1/projects')
        const projects = response.body
    
        // expectation
        expect(projects).toEqual(expectedProjects)
      })
      it('should return all the palettes in the DB', async () => {
        const expectedPalettes = await database('palettes').select()
        expectedPalettes.forEach(palette => {
          palette.created_at = palette.created_at.toJSON();
          palette.updated_at = palette.updated_at.toJSON();
        })

        const response = await request(app).get('/api/v1/palettes')
        const palettes = response.body;
        expect(palettes).toEqual(expectedPalettes);
      })
    })
    describe('GET /projects/:id && /palettes/:id', () => {
      it('should return a single project with the id in the params', async () => {
        const expectedProject = await database('projects').first()
        expectedProject.created_at = expectedProject.created_at.toJSON()
        expectedProject.updated_at = expectedProject.updated_at.toJSON()
        
        const id = expectedProject.id;
  
        const response = await request(app).get(`/api/v1/projects/${id}`)
        const project = response.body;
        
  
        expect(project).toEqual(expectedProject)
      })
      it('should return a single palette with the id in the params', async () => {
        const expectedPalette = await database('palettes').first();
        expectedPalette.created_at = expectedPalette.created_at.toJSON();
        expectedPalette.updated_at = expectedPalette.updated_at.toJSON();

        const id = expectedPalette.id;

        const response = await request(app).get(`/api/v1/palettes/${id}`)
        const palette = response.body;

        expect(palette).toEqual(expectedPalette)
      })
    })
  })
  describe('POST Methods for Palettes & Projects', () => {
    describe('POST /projects && /palettes', () => {
      it('should post a new project to the database', async () => {
        const newProject = {name: 'BYOB'}

        const response = await request(app).post('/api/v1/projects').send(newProject)
        const id = response.body.id;
        const project = await database('projects').where('id', id).first();

        expect(newProject.name).toEqual(project.name)
      })
      it('should post a new palette to the database', async () => {
        let newPalette = {
          palette_name: 'Test Put',
          color_1: '3e3e3e',
          color_2: '6f6f6f',
          color_3: '7e7e7e',
          color_4: 'eeeeee',
          color_5: '999999'
        }

        const response = await request(app).post('/api/v1/palettes').send(newPalette);
        const id = response.body.id;
        console.log('id', id);
        console.log('response', response.body);
        const palettes = await database('palettes').select();
        console.log('DB Palettes', palettes);
        const palette = await database('palettes').where('id', id).first();

        expect(newPalette.color_1).toEqual(palette.color_1);
      })
    })
  })
  
  describe('PUT Methods for Palettes & Projects', () => {

  })
  describe('DELETE Methods for Palettes & Projects', () => {
  })
})