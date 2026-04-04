const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/authController');
const { expect } = chai;

describe('Auth Controller Tests', () => {

    it('should register a new user successfully', async () => {
        const req = {
            body: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            }
        };
        const createdUser = {
            id: new mongoose.Types.ObjectId().toString(),
            name: req.body.name,
            email: req.body.email
        };
        const findStub = sinon.stub(User, 'findOne').resolves(null);
        const createStub = sinon.stub(User, 'create').resolves(createdUser);
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        await registerUser(req, res);
        expect(res.status.calledWith(201)).to.be.true;
        findStub.restore();
        createStub.restore();
    });

    it('should return 400 if user already exists', async () => {
        const req = {
            body: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            }
        };
        const findStub = sinon.stub(User, 'findOne').resolves({ email: 'test@example.com' });
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        await registerUser(req, res);
        expect(res.status.calledWith(400)).to.be.true;
        findStub.restore();
    });

    it('should return 401 for invalid login credentials', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'wrongpassword'
            }
        };
        const findStub = sinon.stub(User, 'findOne').resolves(null);
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        await loginUser(req, res);
        expect(res.status.calledWith(401)).to.be.true;
        findStub.restore();
    });

    it('should return 401 if protected route accessed without token', async () => {
        const req = { headers: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        const { protect } = require('../middleware/authMiddleware');
        await protect(req, res, () => {});
        expect(res.status.calledWith(401)).to.be.true;
    });

});