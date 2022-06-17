const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

describe('User workflow tests', () => {

    it('should register + login a user, create task and verify 1 in DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Peter-Petersen",
            email: "mail@petersen.com",
            password: "123456"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {

                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);

                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "mail@petersen.com",
                        "password": "123456"
                    })
                    .end((err, res) => {
                        // Asserts                        
                        expect(res.status).to.be.equal(200);
                        expect(res.body.error).to.be.equal(null);
                        let token = res.body.data.token;
                        
                        // 3) Create new task
                        let task =
                        {
                            title: "Task",
                            description: "Test task Description",
                            priority: 10,
                            deadline: "2022-05-23T00:00:00.000Z",
                            situation: "Done"
                        };

                        chai.request(server)
                            .post('/api/tasks')
                            .set({ "auth-token": token })
                            .send(task)
                            .end((err, res) => {
                                // Asserts
                                expect(res.status).to.be.equal(201);
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);

                                let savedtask = res.body[0];
                                expect(savedtask.title).to.be.equal(task.title);
                                expect(savedtask.description).to.be.equal(task.description);
                                expect(savedtask.priority).to.be.equal(task.priority);
                                expect(savedtask.deadline).to.be.equal(task.deadline);
                                expect(savedtask.situation).to.be.equal(task.situation);

                                // 4) Verify one task in test DB
                                chai.request(server)
                                    .get('/api/tasks')
                                    .end((err, res) => {

                                        // Asserts
                                        expect(res.status).to.be.equal(200);
                                        expect(res.body).to.be.a('array');
                                        expect(res.body.length).to.be.eql(1);

                                        done();
                                    });
                            });
                            // 5) Create new list
                        let list =
                        {
                            title: "List"
                        };

                        chai.request(server)
                            .post('/api/lists')
                            .set({ "auth-token": token })
                            .send(list)
                            .end((err, res) => {
                                // Asserts
                                expect(res.status).to.be.equal(201);
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);

                                let savedlist = res.body[0];
                                expect(savedlist.title).to.be.equal(list.title);

                                // 6) Verify one list in test DB
                                chai.request(server)
                                    .get('/api/lists')
                                    .end((err, res) => {

                                        // Asserts
                                        expect(res.status).to.be.equal(200);
                                        expect(res.body).to.be.a('array');
                                        expect(res.body.length).to.be.eql(1);

                                        done();
                                    });
                            });
                    });
            });
    });


    // Valid input test (register, login, )
    it('should register + login a user, create task and delete it from DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Peter Petersen",
            email: "mail@petersen.com",
            password: "123456"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {

                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);

                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "mail@petersen.com",
                        "password": "123456"
                    })
                    .end((err, res) => {
                        // Asserts                        
                        expect(res.status).to.be.equal(200);
                        expect(res.body.error).to.be.equal(null);
                        let token = res.body.data.token;

                        // 3) Create new task
                        let task =
                        {
                            title: "Task",
                            description: "Test task Description",
                            priority: 10,
                            deadline: "2022-05-23T00:00:00.000Z",
                            situation: "Done"
                        };

                        chai.request(server)
                            .post('/api/tasks')
                            .set({ "auth-token": token })
                            .send(task)
                            .end((err, res) => {

                                // Asserts
                                expect(res.status).to.be.equal(201);
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);

                                let savedtask = res.body[0];
                                expect(savedtask.title).to.be.equal(task.title);
                                expect(savedtask.description).to.be.equal(task.description);
                                expect(savedtask.priority).to.be.equal(task.priority);
                                expect(savedtask.deadline).to.be.equal(task.deadline);
                                expect(savedtask.situation).to.be.equal(task.situation);

                                // 4) Delete task
                                chai.request(server)
                                    .delete('/api/tasks/' + savedtask._id)
                                    .set({ "auth-token": token })
                                    .end((err, res) => {

                                        // Asserts
                                        expect(res.status).to.be.equal(200);
                                        const actualVal = res.body.message;
                                        expect(actualVal).to.be.equal('task was successfully deleted.');
                                        done();
                                    });

                            });
                    });
                     // 5) Create new list
                     let list =
                     {
                         title: "List"
                     };

                     chai.request(server)
                         .post('/api/lists')
                         .set({ "auth-token": token })
                         .send(list)
                         .end((err, res) => {

                             // Asserts
                             expect(res.status).to.be.equal(201);
                             expect(res.body).to.be.a('array');
                             expect(res.body.length).to.be.eql(1);

                             let savedlist = res.body[0];
                             expect(savedlist.title).to.be.equal(list.title);

                             // 6) Delete list
                             chai.request(server)
                                 .delete('/api/lists/' + savedlist._id)
                                 .set({ "auth-token": token })
                                 .end((err, res) => {

                                     // Asserts
                                     expect(res.status).to.be.equal(200);
                                     const actualVal = res.body.message;
                                     expect(actualVal).to.be.equal('list was successfully deleted.');
                                     done();
                                 });

                         });
                 });
            });
    });



    // Invalid input test
    it('should register user with invalid input', (done) => {

        // 1) Register new user with invalid inputs
        let user = {
            name: "Peter Petersen",
            email: "mail@petersen.com",
            password: "123" //Faulty password - Joi/validation should catch this...
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {

                // Asserts
                expect(res.status).to.be.equal(400); //normal expect with no custom output message
                //expect(res.status,"Status is not 400 (NOT FOUND)").to.be.equal(400); //custom output message at fail

                expect(res.body).to.be.a('object');
                expect(res.body.error.message).to.be.equal("\"password\" length must be at least 6 characters long");
                done();
            });
    });
});