const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.enable('trust proxy');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((request, response, next) => {
    console.log('secure ', request.secure)
    console.log('header ', request.header)
    if (request.secure) {
        next();
    } else {
        response.redirect('https://' + request.headers.host + request.url);
    }
})

app.set('port', process.env.PORT || 3000);

app.post('/api/v1/projects', (request, response) => {
    const project_name = request.body;

    database('projects').insert(project_name, '*')
    .then( project => {
        response.status(201).json(project)
    })
    .catch( error => {
        response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
    const palette = request.body;

    database('palettes').insert(palette, '*')
    .then( palette => {
        response.status(201).json(palette)
    })
    .catch( error => {
        response.status(500).json({ error });
    });
});

app.get('/api/v1/projects', (request, response) => {
    database('projects').select()
    .then( project => {
        response.status(200).json(project);
    })
    .catch( err => {
        response.status(500).json({ err })
    });
});

app.get('/api/v1/palettes', (request, response) => {
    database('palettes').select()
    .then( palette => {
        response.status(200).json(palette);
    })
    .catch( err => {
        response.status(500).json({ err })
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
    database('palettes')
    .where({ project_id: request.params.id }).select()
    .then( palette => {
        response.status(200).json(palette);
    })
    .catch( err => {
        response.status(500).json({ err })
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
    const id = request.params;

    database('palettes')
    .where(id)
    .del()
    .then( result => {
        if(!result) {
            response.status(422).json({ error: 'This palette doesn\'t seem to exists' })
        } else {
            response.sendStatus(204)
        }
    })
    .catch( err => response.status(500).json({ err }))
});


app.listen(app.get('port'), () => {
    console.log('Hello?, Is your server running?');
    console.log('--yea?');
    console.log('Then you better go catch it!!!');
});

module.exports = app;