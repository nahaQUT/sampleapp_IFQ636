const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const { createDoctor } = require('../controllers/doctorController');

const { expect } = chai;

describe('Doctor Controller Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should create a new doctor successfully', async () => {
    const req = {
      body: {
        name: 'Dr. Sarah Lee',
        specialization: 'Cardiology',
        email: 'sarah.lee@meditrack.com',
        phone: '0412345678',
        isAvailable: true,
      },
    };

    const createdDoctor = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    };

    const createStub = sinon.stub(Doctor, 'create').resolves(createdDoctor);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createDoctor(req, res);

    expect(createStub.calledOnceWith(req.body)).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdDoctor)).to.be.true;
  });

  it('should return 500 if doctor creation fails', async () => {
    const req = {
      body: {
        name: 'Dr. Sarah Lee',
        specialization: 'Cardiology',
        email: 'sarah.lee@meditrack.com',
        phone: '0412345678',
        isAvailable: true,
      },
    };

    sinon.stub(Doctor, 'create').throws(new Error('DB Error'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createDoctor(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});