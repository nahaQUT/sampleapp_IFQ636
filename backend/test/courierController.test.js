const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Courier = require('../models/Courier');
const { createCourier, getCouriers, getCourierById, updateCourier, deleteCourier } = require('../controllers/courierController');
const { expect } = chai;

describe('Courier Controller Tests', () => {

  afterEach(() => {
    sinon.restore();
  });

  // ==================== CREATE ====================
  describe('createCourier', () => {
    it('should create a new courier successfully', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '0412345678',
          vehicle: 'motorcycle',
          zone: 'Brisbane CBD'
        }
      };

      const createdCourier = { _id: new mongoose.Types.ObjectId(), ...req.body, createdBy: req.user.id };

      sinon.stub(Courier, 'findOne').resolves(null);
      const createStub = sinon.stub(Courier, 'create').resolves(createdCourier);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createCourier(req, res);

      expect(createStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdCourier)).to.be.true;
    });

    it('should return 400 if courier email already exists', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '0412345678',
          vehicle: 'motorcycle',
          zone: 'Brisbane CBD'
        }
      };

      sinon.stub(Courier, 'findOne').resolves({ _id: new mongoose.Types.ObjectId(), email: 'mike@example.com' });

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createCourier(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Courier with this email already exists' })).to.be.true;
    });

    it('should return 500 if an error occurs during creation', async () => {
      sinon.stub(Courier, 'findOne').resolves(null);
      sinon.stub(Courier, 'create').throws(new Error('DB Error'));

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '0412345678',
          vehicle: 'motorcycle',
          zone: 'Brisbane CBD'
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createCourier(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // ==================== READ (Get All) ====================
  describe('getCouriers', () => {
    it('should return all couriers for the logged-in user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockCouriers = [
        { _id: new mongoose.Types.ObjectId(), name: 'Mike', createdBy: userId },
        { _id: new mongoose.Types.ObjectId(), name: 'Sarah', createdBy: userId }
      ];

      const sortStub = sinon.stub().resolves(mockCouriers);
      sinon.stub(Courier, 'find').returns({ sort: sortStub });

      const req = { user: { id: userId } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getCouriers(req, res);

      expect(res.json.calledWith(mockCouriers)).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
      sinon.stub(Courier, 'find').throws(new Error('DB Error'));

      const req = { user: { id: new mongoose.Types.ObjectId() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getCouriers(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // ==================== READ (Get By ID) ====================
  describe('getCourierById', () => {
    it('should return a courier by ID', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockCourier = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Mike',
        createdBy: userId
      };

      sinon.stub(Courier, 'findById').resolves(mockCourier);

      const req = { params: { id: mockCourier._id }, user: { id: userId.toString() } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getCourierById(req, res);

      expect(res.json.calledWith(mockCourier)).to.be.true;
    });

    it('should return 404 if courier not found', async () => {
      sinon.stub(Courier, 'findById').resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId() }, user: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getCourierById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Courier not found' })).to.be.true;
    });
  });

  // ==================== UPDATE ====================
  describe('updateCourier', () => {
    it('should update a courier successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockCourier = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Mike',
        email: 'mike@example.com',
        phone: '0412345678',
        vehicle: 'motorcycle',
        zone: 'Brisbane CBD',
        status: 'available',
        createdBy: userId,
        save: sinon.stub()
      };
      mockCourier.save.resolves({ ...mockCourier, name: 'Updated Mike' });

      sinon.stub(Courier, 'findById').resolves(mockCourier);

      const req = {
        params: { id: mockCourier._id },
        user: { id: userId.toString() },
        body: { name: 'Updated Mike' }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await updateCourier(req, res);

      expect(mockCourier.save.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return 404 if courier not found', async () => {
      sinon.stub(Courier, 'findById').resolves(null);

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { id: new mongoose.Types.ObjectId().toString() },
        body: { name: 'Updated' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await updateCourier(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  // ==================== DELETE ====================
  describe('deleteCourier', () => {
    it('should delete a courier successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockCourier = {
        _id: new mongoose.Types.ObjectId(),
        createdBy: userId,
        deleteOne: sinon.stub().resolves()
      };

      sinon.stub(Courier, 'findById').resolves(mockCourier);

      const req = { params: { id: mockCourier._id }, user: { id: userId.toString() } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await deleteCourier(req, res);

      expect(mockCourier.deleteOne.calledOnce).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Courier removed' })).to.be.true;
    });

    it('should return 404 if courier not found', async () => {
      sinon.stub(Courier, 'findById').resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId() }, user: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteCourier(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
