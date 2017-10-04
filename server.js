const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

app.post('/api/v1/projects/', (request, response) => {
    
})

app.listen(app.get('port'), () => {
    console.log('the server hears you bro!')
});