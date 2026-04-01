const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Parcel = require('../models/Parcel');
const { createParcel, getParcels, getParcelById, updateParcel, deleteParcel } = require('../controllers/parcelController');
const { expect } = chai;

describe('Parcel Controller Tests', () => {

  afterEach(() => {
    sinon.restore();
  });

  // ==================== CREATE ====================
  describe('createParcel', () => {
    it('should create a new parcel successfully', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          sender: 'John Doe',
          senderAddress: '123 Main St',
          senderPhone: '0412345678',
          recipient: 'Jane Smith',
          recipientAddress: '456 Oak Ave',
          recipientPhone: '0498765432',
          weight: 2.5,
          description: 'Fragile items'
        }
      };

      const createdParcel = { _id: new mongoose.Types.ObjectId(), ...req.body, createdBy: req.user.id };
      const createStub = sinon.stub(Parcel, 'create').resolves(createdParcel);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createParcel(req, res);

      expect(createStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdParcel)).to.be.true;
    });

    it('should return 500 if an error occurs during creation', async () => {
      const createStub = sinon.stub(Parcel, 'create').throws(new Error('DB Error'));

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          sender: 'John Doe',
          senderAddress: '123 Main St',
          senderPhone: '0412345678',
          recipient: 'Jane Smith',
          recipientAddress: '456 Oak Ave',
          recipientPhone: '0498765432',
          weight: 2.5,
          description: 'Fragile items'
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createParcel(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // ==================== READ (Get All) ====================
  describe('getParcels', () => {
    it('should return all parcels for the logged-in user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockParcels = [
        { _id: new mongoose.Types.ObjectId(), sender: 'John', createdBy: userId },
        { _id: new mongoose.Types.ObjectId(), sender: 'Alice', createdBy: userId }
      ];

      const sortStub = sinon.stub().resolves(mockParcels);
      const findStub = sinon.stub(Parcel, 'find').returns({ sort: sortStub });

      const req = { user: { id: userId } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getParcels(req, res);

      expect(findStub.calledOnceWith({ createdBy: userId })).to.be.true;
      expect(res.json.calledWith(mockParcels)).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
      sinon.stub(Parcel, 'find').throws(new Error('DB Error'));

      const req = { user: { id: new mongoose.Types.ObjectId() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getParcels(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // ==================== READ (Get By ID) ====================
  describe('getParcelById', () => {
    it('should return a parcel by ID', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockParcel = {
        _id: new mongoose.Types.ObjectId(),
        sender: 'John',
        createdBy: userId
      };

      sinon.stub(Parcel, 'findById').resolves(mockParcel);

      const req = { params: { id: mockParcel._id }, user: { id: userId.toString() } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getParcelById(req, res);

      expect(res.json.calledWith(mockParcel)).to.be.true;
    });

    it('should return 404 if parcel not found', async () => {
      sinon.stub(Parcel, 'findById').resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId() }, user: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getParcelById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Parcel not found' })).to.be.true;
    });
  });

  // ==================== UPDATE ====================
  describe('updateParcel', () => {
    it('should update a parcel successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockParcel = {
        _id: new mongoose.Types.ObjectId(),
        sender: 'John',
        senderAddress: '123 Main St',
        senderPhone: '0412345678',
        recipient: 'Jane',
        recipientAddress: '456 Oak Ave',
        recipientPhone: '0498765432',
        weight: 2.5,
        description: 'Old description',
        status: 'pending',
        createdBy: userId,
        save: sinon.stub()
      };
      mockParcel.save.resolves({ ...mockParcel, sender: 'Updated John' });

      sinon.stub(Parcel, 'findById').resolves(mockParcel);

      const req = {
        params: { id: mockParcel._id },
        user: { id: userId.toString() },
        body: { sender: 'Updated John' }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await updateParcel(req, res);

      expect(mockParcel.save.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return 404 if parcel not found', async () => {
      sinon.stub(Parcel, 'findById').resolves(null);

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { id: new mongoose.Types.ObjectId().toString() },
        body: { sender: 'Updated' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await updateParcel(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  // ==================== DELETE ====================
  describe('deleteParcel', () => {
    it('should delete a parcel successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockParcel = {
        _id: new mongoose.Types.ObjectId(),
        createdBy: userId,
        deleteOne: sinon.stub().resolves()
      };

      sinon.stub(Parcel, 'findById').resolves(mockParcel);

      const req = { params: { id: mockParcel._id }, user: { id: userId.toString() } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await deleteParcel(req, res);

      expect(mockParcel.deleteOne.calledOnce).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Parcel removed' })).to.be.true;
    });

    it('should return 404 if parcel not found', async () => {
      sinon.stub(Parcel, 'findById').resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId() }, user: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteParcel(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
