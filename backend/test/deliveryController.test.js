const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Delivery = require('../models/Delivery');
const { createDelivery, getDeliveries, getDeliveryById, updateDelivery, deleteDelivery } = require('../controllers/deliveryController');
const { expect } = chai;

describe('Delivery Controller Tests', () => {

  afterEach(() => {
    sinon.restore();
  });

  // ==================== CREATE ====================
  describe('createDelivery', () => {
    it('should create a new delivery successfully', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          parcel: new mongoose.Types.ObjectId(),
          courier: new mongoose.Types.ObjectId(),
          pickupTime: '2025-04-01T10:00:00Z',
          notes: 'Handle with care'
        }
      };

      const createdDelivery = {
        _id: new mongoose.Types.ObjectId(),
        ...req.body,
        createdBy: req.user.id,
        populate: sinon.stub()
      };
      createdDelivery.populate.resolves(createdDelivery);

      sinon.stub(Delivery, 'create').resolves(createdDelivery);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createDelivery(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdDelivery)).to.be.true;
    });

    it('should return 500 if an error occurs during creation', async () => {
      sinon.stub(Delivery, 'create').throws(new Error('DB Error'));

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          parcel: new mongoose.Types.ObjectId(),
          courier: new mongoose.Types.ObjectId(),
          pickupTime: '2025-04-01T10:00:00Z',
          notes: 'Handle with care'
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createDelivery(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // ==================== READ (Get All) ====================
  describe('getDeliveries', () => {
    it('should return all deliveries for the logged-in user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockDeliveries = [
        { _id: new mongoose.Types.ObjectId(), status: 'assigned', createdBy: userId },
        { _id: new mongoose.Types.ObjectId(), status: 'delivered', createdBy: userId }
      ];

      const sortStub = sinon.stub().resolves(mockDeliveries);
      const populateCourierStub = sinon.stub().returns({ sort: sortStub });
      const populateParcelStub = sinon.stub().returns({ populate: populateCourierStub });
      sinon.stub(Delivery, 'find').returns({ populate: populateParcelStub });

      const req = { user: { id: userId } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getDeliveries(req, res);

      expect(res.json.calledWith(mockDeliveries)).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
      sinon.stub(Delivery, 'find').throws(new Error('DB Error'));

      const req = { user: { id: new mongoose.Types.ObjectId() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getDeliveries(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // ==================== READ (Get By ID) ====================
  describe('getDeliveryById', () => {
    it('should return a delivery by ID', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockDelivery = {
        _id: new mongoose.Types.ObjectId(),
        status: 'assigned',
        createdBy: userId
      };

      const populateCourierStub = sinon.stub().resolves(mockDelivery);
      const populateParcelStub = sinon.stub().returns({ populate: populateCourierStub });
      sinon.stub(Delivery, 'findById').returns({ populate: populateParcelStub });

      const req = { params: { id: mockDelivery._id }, user: { id: userId.toString() } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getDeliveryById(req, res);

      expect(res.json.calledWith(mockDelivery)).to.be.true;
    });

    it('should return 404 if delivery not found', async () => {
      const populateCourierStub = sinon.stub().resolves(null);
      const populateParcelStub = sinon.stub().returns({ populate: populateCourierStub });
      sinon.stub(Delivery, 'findById').returns({ populate: populateParcelStub });

      const req = { params: { id: new mongoose.Types.ObjectId() }, user: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getDeliveryById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Delivery not found' })).to.be.true;
    });
  });

  // ==================== UPDATE ====================
  describe('updateDelivery', () => {
    it('should update a delivery successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockDelivery = {
        _id: new mongoose.Types.ObjectId(),
        parcel: new mongoose.Types.ObjectId(),
        courier: new mongoose.Types.ObjectId(),
        pickupTime: null,
        deliveredTime: null,
        status: 'assigned',
        notes: 'Old notes',
        createdBy: userId,
        save: sinon.stub()
      };

      const updatedDelivery = { ...mockDelivery, status: 'in_transit', populate: sinon.stub() };
      updatedDelivery.populate.resolves(updatedDelivery);
      mockDelivery.save.resolves(updatedDelivery);

      sinon.stub(Delivery, 'findById').resolves(mockDelivery);

      const req = {
        params: { id: mockDelivery._id },
        user: { id: userId.toString() },
        body: { status: 'in_transit' }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await updateDelivery(req, res);

      expect(mockDelivery.save.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return 404 if delivery not found', async () => {
      sinon.stub(Delivery, 'findById').resolves(null);

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { id: new mongoose.Types.ObjectId().toString() },
        body: { status: 'in_transit' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await updateDelivery(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  // ==================== DELETE ====================
  describe('deleteDelivery', () => {
    it('should delete a delivery successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockDelivery = {
        _id: new mongoose.Types.ObjectId(),
        createdBy: userId,
        deleteOne: sinon.stub().resolves()
      };

      sinon.stub(Delivery, 'findById').resolves(mockDelivery);

      const req = { params: { id: mockDelivery._id }, user: { id: userId.toString() } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await deleteDelivery(req, res);

      expect(mockDelivery.deleteOne.calledOnce).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Delivery removed' })).to.be.true;
    });

    it('should return 404 if delivery not found', async () => {
      sinon.stub(Delivery, 'findById').resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId() }, user: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteDelivery(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
