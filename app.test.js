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
    describe('GET /projects', () => {
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
    })
    describe('GET /projects/:id', () => {
      it('should return a single project with the id in the params', async () => {
        const expectedProject = await database('projects').first()
        expectedProject.created_at = expectedProject.created_at.toJSON()
        expectedProject.updated_at = expectedProject.updated_at.toJSON()
        
        const id = expectedProject.id;
  
        const response = await request(app).get(`/api/v1/projects/${id}`)
        const project = response.body;
        
  
        expect(project).toEqual(expectedProject)
      })
    })
  })
  describe('POST Methods for Palettes & Projects', () => {
    describe('POST /projects', () => {
      it('should post a new project to the database', async () => {
        const newProject = {name: 'BYOB'}

        const response = await request(app).post('/api/v1/projects').send(newProject)
        const id = response.body.id;
        const project = await database('projects').where('id', id).first();

        expect(newProject.name).toEqual(project.name)
      })
    })
  })
  describe('PUT Methods for Palettes & Projects', () => {
  })
  describe('DELETE Methods for Palettes & Projects', () => {
  })
})