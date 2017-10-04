const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

app.post('/api/v1/projects/', (request, response) => {
    const project_name = request.body

    database('projects').insert(project_name, '*')
    .then( project => {
        response.status(201).json(project)
    })
    .catch( error => {
        response.status(500).json({ error });
    })
})

app.post('/api/v1/palettes/', (request, response) => {
    const { name, hex1, hex2, hex3, hex4, hex5, project_id } = request.body

    database('palettes').insert({ name, hex1, hex2, hex3, hex4, hex5, project_id }, '*')
    .then( palette => {
        response.status(201).json(palette)
    })
    .catch( error => {
        response.status(500).json({ error });
    })
})

app.get('/api/v1/projects', (request, response) => {
    database('projects').select()
    .then
});


app.listen(app.get('port'), () => {
    console.log('the server hears you bro!')
})