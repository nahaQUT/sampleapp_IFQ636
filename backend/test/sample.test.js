const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const Habit = require('../models/Habit');
const Category = require('../models/Category');

const {
  createHabit,
  getMyHabits,
  updateHabit,
  deleteHabit,
} = require('../controllers/habitController');

function mockResponse() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
}

describe('Habit CRUD Tests (8 tests)', () => {

  afterEach(() => {
    sinon.restore();
  });

  // ===== CREATE =====
  it('createHabit should return 201 (success)', async () => {
    const req = {
      body: { title: 'Test', category: 'cat123' },
      user: { _id: 'user123' }
    };
    const res = mockResponse();

    sinon.stub(Category, 'findById').resolves({ _id: 'cat123' });
    sinon.stub(Habit, 'create').resolves({ _id: 'habit123' });
    sinon.stub(Habit, 'findById').returns({
      populate: sinon.stub().resolves({})
    });

    await createHabit(req, res);

    expect(res.status.calledWith(201)).to.equal(true);
  });

  it('createHabit should return 500 (server error)', async () => {
    const req = {
      body: { title: 'Test', category: 'cat123' },
      user: { _id: 'user123' }
    };
    const res = mockResponse();

    sinon.stub(Category, 'findById').rejects(new Error('DB error'));

    await createHabit(req, res);

    expect(res.status.calledWith(500)).to.equal(true);
  });

  // ===== GET =====
  it('getMyHabits should return 200 (success)', async () => {
    const req = { user: { _id: 'user123' } };
    const res = mockResponse();

    sinon.stub(Habit, 'find').returns({
      populate: sinon.stub().returns({
        sort: sinon.stub().resolves([])
      })
    });

    await getMyHabits(req, res);

    expect(res.status.calledWith(200)).to.equal(true);
  });

  it('getMyHabits should return 500 (server error)', async () => {
    const req = { user: { _id: 'user123' } };
    const res = mockResponse();

    sinon.stub(Habit, 'find').throws(new Error('DB error'));

    await getMyHabits(req, res);

    expect(res.status.calledWith(500)).to.equal(true);
  });

  // ===== UPDATE =====
  it('updateHabit should return 200 (success)', async () => {
    const req = {
      params: { id: 'habit123' },
      body: {},
      user: { _id: 'user123' }
    };
    const res = mockResponse();

    const habit = {
      save: sinon.stub().resolves({ _id: 'habit123' }),
      frequency: 'daily',
      daysOfWeek: []
    };

    sinon.stub(Habit, 'findOne').resolves(habit);
    sinon.stub(Habit, 'findById').returns({
      populate: sinon.stub().resolves({})
    });

    await updateHabit(req, res);

    expect(res.status.calledWith(200)).to.equal(true);
  });

  it('updateHabit should return 500 (server error)', async () => {
    const req = {
      params: { id: 'habit123' },
      body: {},
      user: { _id: 'user123' }
    };
    const res = mockResponse();

    sinon.stub(Habit, 'findOne').rejects(new Error('DB error'));

    await updateHabit(req, res);

    expect(res.status.calledWith(500)).to.equal(true);
  });

  // ===== DELETE =====
  it('deleteHabit should return 200 (success)', async () => {
    const req = {
      params: { id: 'habit123' },
      user: { _id: 'user123' }
    };
    const res = mockResponse();

    sinon.stub(Habit, 'findOne').resolves({
      deleteOne: sinon.stub().resolves()
    });

    await deleteHabit(req, res);

    expect(res.status.calledWith(200)).to.equal(true);
  });

  it('deleteHabit should return 500 (server error)', async () => {
    const req = {
      params: { id: 'habit123' },
      user: { _id: 'user123' }
    };
    const res = mockResponse();

    sinon.stub(Habit, 'findOne').rejects(new Error('DB error'));

    await deleteHabit(req, res);

    expect(res.status.calledWith(500)).to.equal(true);
  });

});