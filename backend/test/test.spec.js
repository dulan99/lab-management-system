const request = require('supertest'); 
const app = require('../app');   // Your Express app
const Test = require('../models/testModel');
const mongoose = require('mongoose'); // If using MongoDB

jest.mock('../models/testModel');

test('creates a new test successfuly', async () => {

    Test.create.mockResolvedValue({ _id: 'testId', name: 'Test Name', ... });

    const response = await request(app)
        .post('/api/v1/tests')
        .send({ name: 'Test Name', description: '...', price: 10 }); 

    expect(response.statusCode).toBe(201); 
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Test created successfully');
});

test('handles creation error', async () => {
    
    Test.create.mockRejectedValue(new Error('Database Error')); 

    const response = await request(app)

    expect(response.statusCode).toBe(500); 
    expect(response.body.success).toBe(false); 

});
