exports.seed = function(knex, Promise) {
  
    return knex('palettes').del() // delete all palettes first
      .then(() => knex('projects').del()) // delete all projects
      .then(() => {
        return Promise.all([
          // Insert a single project, return the project ID, insert 2 palettes
          knex('projects').insert({
            id: 1,
            project_name: 'The Manhattan Project'
          }, 'id')
          .then(project => {
            return knex('palettes').insert([
              {
                id: 1,
                name: 'Rainbow Bright',
                hex1: '#84D339',
                hex2: '#5A70E9',
                hex3: '#08679E',
                hex4: '#8EDBBA',
                hex5: '#A2841F',
                project_id: project[0]
              },
              {
                id: 2,
                name: 'Rainbow not so Bright',
                hex1: '#D0A802',
                hex2: '#0E8117',
                hex3: '#12AE5F',
                hex4: '#77594A',
                hex5: '#A70BFA',
                project_id: project[0]
              },
            ])
          })
          .then(() => console.log('The data was successfully seeded!'))
          .catch(error => console.log(`There was an error seeding the data: ${error}`)),
        ]);
      })
      .catch(error => console.log(`There was an error seeding the data: ${error}`));
  };