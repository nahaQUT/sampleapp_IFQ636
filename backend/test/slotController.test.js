const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Slot = require('../models/Slot');
const { createSlot } = require('../controllers/slotController');

const { expect } = chai;

describe('Slot Controller Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should create a new slot successfully', async () => {
    const req = {
      body: {
        doctor: new mongoose.Types.ObjectId(),
        date: '30 March 2026',
        startTime: '10:00 AM',
        endTime: '10:30 AM',
        isBooked: false,
      },
    };

    const createdSlot = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    };

    const createStub = sinon.stub(Slot, 'create').resolves(createdSlot);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createSlot(req, res);

    expect(createStub.calledOnceWith(req.body)).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdSlot)).to.be.true;
  });

  it('should return 500 if slot creation fails', async () => {
    const req = {
      body: {
        doctor: new mongoose.Types.ObjectId(),
        date: '30 March 2026',
        startTime: '10:00 AM',
        endTime: '10:30 AM',
        isBooked: false,
      },
    };

    sinon.stub(Slot, 'create').throws(new Error('DB Error'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createSlot(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});