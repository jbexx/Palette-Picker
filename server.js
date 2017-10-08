// importing the express framework to use with node.js
const express = require('express');
const app = express();

// middleware that parses request bodies so that they are in a usable format
const path = require('path');
const bodyParser = require('body-parser');

// these configure our environment to be used on multiple servers through knex
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

// using the body parser middleware that we imported above
app.use(bodyParser.json());

// middleware that allows node to host our static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// setting the port to 3000 or whatever our environment port will be when on heroku
app.set('port', process.env.PORT || 3000);

// creating an endpoint to post a new project to
app.post('/api/v1/projects', (request, response) => {
    // setting the request body to a variable to use throughout the post function
    const project_name = request.body;

    // declairing the database we are inserting the project into and inserting the request body and returning all of it
    database('projects').insert(project_name, '*')
    // because insert returns a promise it is being handled with .then
    .then( project => {
        // setting the response status to 201 if the promise is resolved correctly and returns the parsed project
        response.status(201).json(project)
    })
    // if the promise is not resolved the .catch will catch the error
    .catch( error => {
        // setting the response status to 500 if there is a server error
        response.status(500).json({ error });
    });
});

// creating an endpoint to post a new palette to
app.post('/api/v1/palettes', (request, response) => {

    // setting the request body to a variable to use throughout the post function    
    const palette = request.body;

    // declairing the database we are inserting the palette into and inserting the request body and returning all of it
    database('palettes').insert(palette, '*')
    // because insert returns a promise it is being handled with .then    
    .then( palette => {
        // setting the response status to 201 if the promise is resolved correctly and returns the parsed palette 
        response.status(201).json(palette)
    })
    // if the promise is not resolved the .catch will catch the error    
    .catch( error => {
        // setting the response status to 500 if there is a server error        
        response.status(500).json({ error });
    });
});

// creating an endpoint to get the projects from the database
app.get('/api/v1/projects', (request, response) => {
    // declairing the database we are selecting all the projects from
    database('projects').select()
    // because select returns a promise it is being handled with .then
    .then( project => {
        // setting the response status to 200 if the promise is resolved correctly and returns the parsed project         
        response.status(200).json(project);
    })
    // if the promise is not resolved the .catch will catch the error        
    .catch( err => {
        // setting the response status to 500 if there is a server error                
        response.status(500).json({ err })
    });
});

// creating an endpoint to get the palettes from the database
app.get('/api/v1/palettes', (request, response) => {
    // declairing the database we are selecting all the palettes from    
    database('palettes').select()
    // because select returns a promise it is being handled with .then
    .then( palette => {
        // setting the response status to 200 if the promise is resolved correctly and returns the parsed palettes         
        response.status(200).json(palette);
    })
    // if the promise is not resolved the .catch will catch the error        
    .catch( err => {
        // setting the response status to 500 if there is a server error                        
        response.status(500).json({ err })
    });
});

// creating an endpoint to get a specific projects palettes from the database
app.get('/api/v1/projects/:id/palettes', (request, response) => {
    // declairing the database we are selecting projects palettes from        
    database('palettes')
    // declairing where we want the projects from.  in this case we want the projects that have the same foriegn id as the projects id
    .where({ project_id: request.params.id }).select()
    // because select returns a promise it is being handled with .then    
    .then( palette => {
        // setting the response status to 200 if the promise is resolved correctly and returns the parsed palettes                 
        response.status(200).json(palette);
    })
    // if the promise is not resolved the .catch will catch the error            
    .catch( err => {
        // setting the response status to 500 if there is a server error                                
        response.status(500).json({ err })
    });
});

// creating an endpoint to delete palettes from the database
app.delete('/api/v1/palettes/:id', (request, response) => {
    // setting the id to a variable to use throughtout the delete function
    const id = request.params;

    // declairing the database we are deleting palettes from        
    database('palettes')
    // declairing which palette we want to delete, in this case where the palette has the same id as the one that is specified in the endpoint
    .where(id)
    // deleting that palette
    .del()
    // the .del() returns a promise that is handled with .then
    .then( result => {
        // if there is not a result from the promise we want throw an error
        if(!result) {
            // setting the response status to 422 if there is no palette with the id we chose
            response.status(422).json({ error: 'This palette doesn\'t seem to exists' })
        } else {
            // if there is a result from the promise we set the response status to 204
            response.sendStatus(204)
        }
    })
    // setting the response status to 500 if there is a server error
    .catch( err => response.status(500).json({ err }))
});

// the app is listening for the server on the 'port' we specified at the top of the file
app.listen(app.get('port'), () => {
    // notes letting me know that Im connected to the server
    console.log('Hello?, Is your server running?');
    console.log('--yea?');
    console.log('Then you better go catch it!!!');
});

// exporting the app for testing
module.exports = app;