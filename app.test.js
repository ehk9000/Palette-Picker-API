const request = require('supertest')
const app = require('./app')
const environment = process.env.NODE_ENV || 'test'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)


describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run
  })
  describe('GET /projects', () => {
    it('should return all the projects in the DB ', async () => {
      // set up 
      const expectedProjects = await database('projects').select()

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
      console.log('expectedProject', expectedProject);
      
      const id = expectedProject.id;

      const response = await request(app).get(`/projects/${id}`)
      const project = response.body;
      

      expect(project).toEqual(expectedProject)
    })
  })
})