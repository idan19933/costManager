

const request = require('supertest');
const chai = require('chai');
const app = require('../app');

const expect = chai.expect;

/**
 * Test suite for Cost Manager API endpoints.
 */
describe('Cost Manager API Tests', () => {

    /**
     * Test GET /api/about endpoint
     * Expects status 200 and an array of team info objects
     */
    it('GET /api/about - should return team info', async () => {
        const res = await request(app).get('/api/about'); // Send a GET request to the /api/about endpoint
        expect(res.status).to.equal(200); // Assert that the response status is 200 (OK)
        expect(res.body).to.be.an('array'); // Assert that the response body is an array
    });

    /**
     * Test POST /api/add endpoint
     * Sends a new cost item and expects status 200 and response to contain 'description' property
     */
    it('POST /api/add - should add a cost', async () => {
        const res = await request(app).post('/api/add').send({ // Send a POST request with data in the request body
            userid: 123123,
            description: 'milk test',
            category: 'food',
            sum: 10
        });

        expect(res.status).to.equal(200); // Assert that the response status is 200 (OK)
        expect(res.body).to.have.property('description'); // Assert that the response body has a property named 'description'
    });

    /**
     * Test GET /api/report endpoint
     * Requests a report for given user/year/month and expects status 200 and 'costs' property in response
     */
    it('GET /api/report - should return report', async () => {
        const res = await request(app).get('/api/report?id=123123&year=2025&month=5'); // Send a GET request with parameters in the query string
        expect(res.status).to.equal(200); // Assert that the response status is 200 (OK)
        expect(res.body).to.have.property('costs'); // Assert that the response body has a property named 'costs'
    });
});

/**
 * Test GET /api/users/:id endpoint
 * Requests user info and expects status 200 and response to have 'first_name' property
 */
it('GET /api/users/:id - should return user data', async () => {
    const res = await request(app).get('/api/users/123123'); // Send a GET request with the ID as part of the path
    expect(res.status).to.equal(200);// Assert that the response status is 200 (OK)
    expect(res.body).to.have.property('first_name'); // Assert that the response body has a property named 'first_name'
});