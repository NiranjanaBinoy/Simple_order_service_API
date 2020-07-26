const Supertest = require('supertest')
const server = require('../server')

class Helper{
    constructor() {
        this.apiServer = Supertest(server)
    }
}

module.exports = Helper