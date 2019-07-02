const projects = require('../../../data/projects');

exports.seed = function(knex) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      const projectPromises = [];
      projects.forEach(project => {
        projectPromises.push(createProject(knex, project))
      })
      return Promise.all(projectPromises);  
    })
    .catch(error => {
      console.log(`Error seeding data: ${error}`)
    })
};

const createProject = (knex, project) => {
  return knex('projects').insert({name: project.name}, 'id')
  .then(projectId => {
    const promises = [];
    if (project.palettes.length) {
      project.palettes.forEach(palette => {
        const {color_1, color_2, color_3, color_4, color_5} = palette;
        promises.push(createPalette(knex, {
          color_1,
          color_2,
          color_3,
          color_4,
          color_5,
          project_id: projectId[0]
        }))
      })
      return Promise.all(promises);
    }
  })
}

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
}
