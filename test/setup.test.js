process.env.NODE_ENV = 'test';

const task = require('../models/task');
const User = require('../models/user');


//clean up the database before and after each test
beforeEach((done) => {
    task.deleteMany({}, function (err) { });
    User.deleteMany({}, function (err) { });
    done();
});

afterEach((done) => {
    User.deleteMany({}, function (err) { });
    task.deleteMany({}, function (err) { });
    done();
});