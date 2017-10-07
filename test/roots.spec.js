const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
    it('should return the hompage with text', (done) => {
        chai.request(server)
        .get('/')
        .end((error, response) => {
            response.should.have.status(200);
            response.should.be.html;
            response.res.text.includes('Palette Picker')            
            done();
        });
    });

    it('should return a 404 if the route does not exist', (done) => {
        chai.request(server)
        .get('/notreal')
        .end((error, response) => {
            response.should.have.status(404);
            done();
        });
    });
});

describe('API Routes', () => {

    before((done) => {
        database.migrate.latest()
        .then( () => done())
        .catch(error => console.log(error))
    });

    beforeEach((done) => {
        database.seed.run()
        .then(() => done())
        .catch(error => console.log(error));
    });

    describe('GET /api/v1/projects', () => {
        it('should get all projects from database', (done) => {
            chai.request(server)
            .get('/api/v1/projects')
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body.length.should.equal(1);
                response.body[0].should.have.property('id');
                response.body[0].id.should.equal(1);
                response.body[0].should.have.property('project_name');
                response.body[0].project_name.should.equal('The Manhattan Project');
                done();
            });
        });

        it('should return a 404 if the route does not exist', (done) => {
            chai.request(server)
            .get('/api/v1/pojects')
            .end((error, response) => {
                response.should.have.status(404);
                done();
            });
        });
    });

    describe('GET /api/v1/palettes', () => {
        it('should get all palettes from database', (done) => {
            chai.request(server)
            .get('/api/v1/palettes')
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body.length.should.equal(2);
                response.body[0].should.have.property('name');
                response.body[0].name.should.equal('Rainbow Bright');
                response.body[0].should.have.property('hex1');
                response.body[0].hex1.should.equal('#84D339');
                response.body[0].should.have.property('hex2');
                response.body[0].hex2.should.equal('#5A70E9');
                response.body[0].should.have.property('hex3');
                response.body[0].hex3.should.equal('#08679E');
                response.body[0].should.have.property('hex4');
                response.body[0].hex4.should.equal('#8EDBBA');
                response.body[0].should.have.property('hex5');
                response.body[0].hex5.should.equal('#A2841F');
                response.body[0].should.have.property('project_id');
                response.body[0].project_id.should.equal(1);
                response.body[1].should.have.property('name');
                response.body[1].name.should.equal('Rainbow not so Bright');
                response.body[1].should.have.property('hex1');
                response.body[1].hex1.should.equal('#D0A802');
                response.body[1].should.have.property('hex2');
                response.body[1].hex2.should.equal('#0E8117');
                response.body[1].should.have.property('hex3');
                response.body[1].hex3.should.equal('#12AE5F');
                response.body[1].should.have.property('hex4');
                response.body[1].hex4.should.equal('#77594A');
                response.body[1].should.have.property('hex5');
                response.body[1].hex5.should.equal('#A70BFA');
                response.body[1].should.have.property('project_id');
                response.body[1].project_id.should.equal(1);
                done();
            });
        });

        it('should return a 404 if route does not exist', (done) => {
            chai.request(server)
            .get('/api/v1/paletes')
            .end((error, response) => {
                response.should.have.status(404);
                done();
            });
        });
    });

    describe('GET /api/v1/projects/:id/palettes', () => {
        it('should get a specific projects palettes', (done) => {
            chai.request(server)
            .get('/api/v1/projects/1/palettes')
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body.length.should.equal(2);
                response.body[0].should.have.property('name');
                response.body[0].name.should.equal('Rainbow Bright');
                response.body[0].should.have.property('hex1');
                response.body[0].hex1.should.equal('#84D339');
                response.body[0].should.have.property('hex2');
                response.body[0].hex2.should.equal('#5A70E9');
                response.body[0].should.have.property('hex3');
                response.body[0].hex3.should.equal('#08679E');
                response.body[0].should.have.property('hex4');
                response.body[0].hex4.should.equal('#8EDBBA');
                response.body[0].should.have.property('hex5');
                response.body[0].hex5.should.equal('#A2841F');
                response.body[0].should.have.property('project_id');
                response.body[0].project_id.should.equal(1);
                response.body[1].should.have.property('name');
                response.body[1].name.should.equal('Rainbow not so Bright');
                response.body[1].should.have.property('hex1');
                response.body[1].hex1.should.equal('#D0A802');
                response.body[1].should.have.property('hex2');
                response.body[1].hex2.should.equal('#0E8117');
                response.body[1].should.have.property('hex3');
                response.body[1].hex3.should.equal('#12AE5F');
                response.body[1].should.have.property('hex4');
                response.body[1].hex4.should.equal('#77594A');
                response.body[1].should.have.property('hex5');
                response.body[1].hex5.should.equal('#A70BFA');
                response.body[1].should.have.property('project_id');
                response.body[1].project_id.should.equal(1);
                done();
            });
        });

        it('should return a status code 500 if the project does not exist', (done) => {
            chai.request(server)
            .get('/api/v1/projects/*/palettes')
            .end((error, response) => {
                response.should.have.status(500);
                done();
            });
        });

        it('should return a status code 404 if the route does not exist', (done) => {
            chai.request(server)
            .get('/api/v1/projects/nope/nope')
            .end((error, response) => {
                response.should.have.status(404);
                done();
            });
        });
    });

    describe('POST /api/v1/projects/', () => {
        it('should create a new project in the database when user saves project', (done) => {
            chai.request(server)
            .post('/api/v1/projects/')
            .send({
                id: 3,
                project_name: 'The Venus Project'
            })
            .end((error, response) => {
                response.should.have.status(201);
                response.body.should.be.a('array');
                response.body.length.should.equal(1);                
                response.body[0].should.have.property('id');
                response.body[0].id.should.equal(3);                
                response.body[0].should.have.property('project_name');
                response.body[0].project_name.should.equal('The Venus Project');
                
                chai.request(server)
                .get('/api/v1/projects')
                .end((error, response) => {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('array');
                    response.body.length.should.equal(2);
                    done();
                });
            });
        });
    });

    describe('POST /api/v1/palettes', () => {
        it('should create a new palette in the database when user saves a palette', (done) => {
            chai.request(server)
            .post('/api/v1/palettes')
            .send({
                id: 3,
                name: 'All the weird colors',
                hex1: '#A94954',
                hex2: '#1DF3BC',
                hex3: '#F940BB',
                hex4: '#1D6CC2',
                hex5: '#58228C',
                project_id: 1
            })
            .end((error, response) => {
                response.should.have.status(201);
                response.body.should.be.a('array');
                response.body.length.should.equal(1);                
                response.body[0].should.have.property('name');
                response.body[0].name.should.equal('All the weird colors');

                chai.request(server)
                .get('/api/v1/projects/1/palettes')
                .end((error, response) => {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('array');
                    response.body.length.should.equal(3);
                    response.body[2].should.have.property('name');
                    response.body[2].name.should.equal('All the weird colors');
                    response.body[2].should.have.property('hex1');
                    response.body[2].hex1.should.equal('#A94954');
                    response.body[2].should.have.property('hex2');
                    response.body[2].hex2.should.equal('#1DF3BC');
                    response.body[2].should.have.property('hex3');
                    response.body[2].hex3.should.equal('#F940BB');
                    response.body[2].should.have.property('hex4');
                    response.body[2].hex4.should.equal('#1D6CC2');
                    response.body[2].should.have.property('hex5');
                    response.body[2].hex5.should.equal('#58228C');
                    response.body[2].should.have.property('project_id');
                    response.body[2].project_id.should.equal(1);
                    done();
                });            
            });
        });
    });

    describe('DELETE /api/v1/palettes/:id', () => {
        it('should remove a palette from the database if the user deletes it', (done) => {
            chai.request(server)
            .delete('/api/v1/palettes/1')
            .end((error, response) => {
                response.should.have.status(204);
                done();
            })
        });

        it('should return a status code of 422 if the palette does not exist', (done) => {
            chai.request(server)
            .delete('/api/v1/palettes/300')
            .end((error, response) => {
                response.should.have.status(422);
                response.body.error.should.equal('This palette doesn\'t seem to exists')
                done();
            });
        });
    });
});