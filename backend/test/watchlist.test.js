const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Watchlist = require('../models/Watchlist');
const WatchlistItem = require('../models/WatchlistItem');
const {
    createWatchlist,
    getAllWatchlists,
    updateWatchlist,
    deleteWatchlist
} = require('../controllers/watchlistController');

const { expect } = chai;

describe('Watchlist Controller Tests', () => {

    it('should create a new watchlist successfully', async () => {
        const req = {
            user: { _id: new mongoose.Types.ObjectId() },
            body: { name: 'My Watchlist', description: 'Test description' }
        };
        const createdWatchlist = {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            description: req.body.description,
            ownerId: req.user._id
        };
        const createStub = sinon.stub(Watchlist, 'create').resolves(createdWatchlist);
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        await createWatchlist(req, res);
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(createdWatchlist)).to.be.true;
        createStub.restore();
    });

    it('should return 500 if create watchlist fails', async () => {
        const req = {
            user: { _id: new mongoose.Types.ObjectId() },
            body: { name: 'My Watchlist' }
        };
        const createStub = sinon.stub(Watchlist, 'create').throws(new Error('DB Error'));
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        await createWatchlist(req, res);
        expect(res.status.calledWith(500)).to.be.true;
        createStub.restore();
    });

    it('should get all watchlists for a user', async () => {
        const req = {
            user: { _id: new mongoose.Types.ObjectId() }
        };
        const watchlists = [
            { _id: new mongoose.Types.ObjectId(), name: 'List 1', ownerId: req.user._id },
            { _id: new mongoose.Types.ObjectId(), name: 'List 2', ownerId: req.user._id }
        ];
        const findStub = sinon.stub(Watchlist, 'find').resolves(watchlists);
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        await getAllWatchlists(req, res);
        expect(res.json.calledWith(watchlists)).to.be.true;
        findStub.restore();
    });

    it('should return 500 if get watchlists fails', async () => {
        const req = {
            user: { _id: new mongoose.Types.ObjectId() }
        };
        const findStub = sinon.stub(Watchlist, 'find').throws(new Error('DB Error'));
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        await getAllWatchlists(req, res);
        expect(res.status.calledWith(500)).to.be.true;
        findStub.restore();
    });

    it('should update a watchlist successfully', async () => {
        const ownerId = new mongoose.Types.ObjectId();
        const req = {
            user: { _id: ownerId },
            params: { id: new mongoose.Types.ObjectId().toString() },
            body: { name: 'Updated Name' }
        };
        const watchlist = {
            _id: req.params.id,
            name: 'Old Name',
            ownerId: ownerId,
            save: sinon.stub().resolves({ name: 'Updated Name' })
        };
        const findStub = sinon.stub(Watchlist, 'findById').resolves(watchlist);
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        await updateWatchlist(req, res);
        expect(res.json.called).to.be.true;
        findStub.restore();
    });

    it('should return 404 if watchlist not found on update', async () => {
        const req = {
            user: { _id: new mongoose.Types.ObjectId() },
            params: { id: new mongoose.Types.ObjectId().toString() },
            body: { name: 'Updated Name' }
        };
        const findStub = sinon.stub(Watchlist, 'findById').resolves(null);
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        await updateWatchlist(req, res);
        expect(res.status.calledWith(404)).to.be.true;
        findStub.restore();
    });

    it('should delete a watchlist successfully', async () => {
        const ownerId = new mongoose.Types.ObjectId();
        const req = {
            user: { _id: ownerId },
            params: { id: new mongoose.Types.ObjectId().toString() }
        };
        const watchlist = {
            _id: req.params.id,
            ownerId: ownerId
        };
        const findStub = sinon.stub(Watchlist, 'findById').resolves(watchlist);
        const deleteStub = sinon.stub(Watchlist, 'findByIdAndDelete').resolves();
        const deleteManyStub = sinon.stub(WatchlistItem, 'deleteMany').resolves();
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        await deleteWatchlist(req, res);
        expect(res.json.called).to.be.true;
        findStub.restore();
        deleteStub.restore();
        deleteManyStub.restore();
    });

    it('should return 401 if no token provided', async () => {
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