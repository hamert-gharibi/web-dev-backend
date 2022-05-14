process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../server');

chai.use(chaiHttp);

describe('/First Test Collection', () => {

    it ('test default API welcome route', (done) => {

        //actual test content in here

        chai.request(server)
        .get('/api/welcome')
        .end((err, res) => {
            res.should.have.status(200);  
            res.body.should.be.a('object');
            
            const actualVal = res.body.message;
            expect(actualVal).to.be.equal('Welcome to the MEN REST API');

            console.log(res.body.message);
            done();
        })        
    })



    it ('should test two values', () => {

        //actual test content in here
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);
    })
})