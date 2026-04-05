const express = require('express');
const router = express.Router();
const {
    createResource,
    getResources,
    getResource,
    updateResource,
    deleteResource
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');


router.get('/', getResources);
router.get('/:id', getResource);


router.post('/', protect, createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);

module.exports = router;
