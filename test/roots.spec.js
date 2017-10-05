const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
    it('should return the hompage with text', (done) => {
        chai.request(server)
        .get('/')
        .end((error, response) => {
            response.should.have.status(200);
            response.should.be.html;
            response.res.text.should.equal('We\'re going to test all the routes!')            
            done();
        });
    });
});

describe('API Routes', () => {

    

});