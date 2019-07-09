const request = require('supertest')
const app = require('./app')
const environment = process.env.NODE_ENV || 'test'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)


describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run();
  })
  describe('GET Methods for Palettes & Projects', () => {
    describe('GET /projects && /palettes', () => {
      it('should return all the projects in the DB ', async () => {
        const expectedProjects = await database('projects').select();
        expectedProjects.forEach(project => {
          project.created_at = project.created_at.toJSON();
          project.updated_at = project.updated_at.toJSON();
        })
  
        const response = await request(app).get('/api/v1/projects');
        const projects = response.body;
    
        expect(projects).toEqual(expectedProjects);
      })

      it('should return the correct project if there is a name query parameter', async () => {
        const expectedProject = await database('projects').first().select();
        expectedProject.created_at = expectedProject.created_at.toJSON();
        expectedProject.updated_at = expectedProject.updated_at.toJSON();

        const response = await request(app).get('/api/v1/projects?name=T');
        
        expect(response.status).toBe(200);
        expect(response.body[0]).toEqual(expectedProject);
      })

      it('should return a 404 error if the name in the query parameter does not match any project names', async () => {
        const response = await request(app).get('/api/v1/projects?name=noproject');

        expect(response.status).toBe(404);
      })

      it('should return all the palettes in the DB', async () => {
        const expectedPalettes = await database('palettes').select();
        expectedPalettes.forEach(palette => {
          palette.created_at = palette.created_at.toJSON();
          palette.updated_at = palette.updated_at.toJSON();
        })

        const response = await request(app).get('/api/v1/palettes');
        const palettes = response.body;

        expect(palettes).toEqual(expectedPalettes);
      })
    })
    describe('GET /projects/:id && /palettes/:id', () => {
      it('should return a single project with the id in the params', async () => {
        const expectedProject = await database('projects').first();
        const id = expectedProject.id;
        expectedProject.created_at = expectedProject.created_at.toJSON();
        expectedProject.updated_at = expectedProject.updated_at.toJSON();
  
        const response = await request(app).get(`/api/v1/projects/${id}`);
        const project = response.body;
        
        expect(project).toEqual(expectedProject);
      })
      it('should return a single palette with the id in the params', async () => {
        const expectedPalette = await database('palettes').first();
        const id = expectedPalette.id;
        expectedPalette.created_at = expectedPalette.created_at.toJSON();
        expectedPalette.updated_at = expectedPalette.updated_at.toJSON();

        const response = await request(app).get(`/api/v1/palettes/${id}`);
        const palette = response.body;

        expect(palette).toEqual(expectedPalette);
      })
    })
  })
  describe('POST Methods for Palettes & Projects', () => {
    it('should post a new project to the database', async () => {
      const newProject = {name: 'BYOB'};

      const response = await request(app).post('/api/v1/projects/').send(newProject);
      const id = response.body.id;
      const project = await database('projects').where('id', id).first();

      expect(newProject.name).toEqual(project.name);
    });

    it('should not post a project to the database if the given name is already used', async () => {
      const newProject = {name: "Test"};

      const response = await request(app).post('/api/v1/projects/').send(newProject);

      expect(response.status).toEqual(422)
      expect(response.body).toEqual('Project name with Test already exists. Please provide a unique name');
    });

    it('should post a new palette to the database', async () => {
      const newPalette = {
        name: 'new fun palette',
        color_1: '3e3e3e',
        color_2: '6f6f6f',
        color_3: '7e7e7e',
        color_4: 'eeeeee',
        color_5: '999999',
        project_name: 'Test'
      };

      const response = await request(app).post('/api/v1/palettes/').send(newPalette);
      const id = response.body.id;
      const palette = await database('palettes').where('id', id).first();

      expect(newPalette.color_1).toEqual(palette.color_1);
    })
  })
  
  describe('PUT Methods for Palettes & Projects', () => {
    it('should update project based on id', async () => {
      const project = await database('projects').first();
      let expectedProject = project;
      expectedProject.name = 'Change Project';
      expectedProject.created_at = expectedProject.created_at.toJSON();
      expectedProject.updated_at = expectedProject.updated_at.toJSON();

      const id = project.id;
      const response = await request(app).put(`/api/v1/projects/${id}`).send(expectedProject);

      expect(id).toEqual(response.body.id);
      expect(response.body).toEqual(expectedProject);

    })
    it('should update palette based on id', async () => {
      const palette = await database('palettes').first();
      let expectedPalette = palette;
      expectedPalette.name = 'Change palette';
      expectedPalette.color_1 = 'A3HTB';
      expectedPalette.color_3 = '1298B';
      expectedPalette.created_at = expectedPalette.created_at.toJSON();
      expectedPalette.updated_at = expectedPalette.updated_at.toJSON();
      

      const id = palette.id;
      const response = await request(app).put(`/api/v1/palettes/${id}`).send(expectedPalette);
      
      expect(id).toEqual(response.body.id);
      expect(response.body).toEqual(expectedPalette);
    })
  })
  describe('DELETE Methods for Palettes & Projects', () => {
    it('should remove the project from the database by id, as well as remove any related palettes', async () => {
      const project = await database('projects').first();
      const id = project.id;

      await request(app).delete(`/api/v1/projects/${id}`);

      const deletedProject = await database('projects').where({id: id}).first();
      const deletedPalettes = await database('palettes').where({project_id: id}).select();

      expect(deletedProject).toEqual(undefined);
      expect(deletedPalettes.length).toEqual(0);
    })
    it('should remove the palette from the database by id', async () => {
      const palette = await database('palettes').first();
      const id = palette.id;

      await request(app).delete(`/api/v1/palettes/${id}`);
      const deletedPalette = await database('palettes').where({id: id}).first();

      expect(deletedPalette).toEqual(undefined);
    })
  })
})