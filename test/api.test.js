const request = require('supertest');
const chai = require('chai');
const app = require('../app'); // your Express app

const expect = chai.expect;

describe('Cost Manager API Tests', () => {

    it('GET /api/about - should return team info', async () => {
        const res = await request(app).get('/api/about');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('POST /api/add - should add a cost', async () => {
        const res = await request(app).post('/api/add').send({
            userid: 123123,
            description: 'milk test',
            category: 'food',
            sum: 10
        });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('description');
    });

    it('GET /api/report - should return report', async () => {
        const res = await request(app).get('/api/report?id=123123&year=2025&month=5');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('costs');
    });

    it('GET /api/users/:id - should return user data', async () => {
        const res = await request(app).get('/api/users/123123');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('first_name');
    });

});
