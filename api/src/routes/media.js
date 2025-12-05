const express = require('express');
const router = express.Router();
const multer = require('multer');
const mediaController = require('../controllers/mediaController');
const { protect, authorize } = require('../middleware/authMiddleware');
const ratingsRouter = require('./ratings');
const commentsRouter = require('./comments');

// Multer setup for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Nested Routers
router.use('/:media_id/ratings', ratingsRouter);
router.use('/:media_id/comments', commentsRouter);

// Routes
router.post(
    '/',
    protect,
    authorize('creator'),
    upload.single('image'),
    mediaController.uploadMedia
);

router.get('/', mediaController.getPublicMedia);
router.get('/:id', mediaController.getMediaById);

router.put(
    '/:id',
    protect,
    authorize('creator'),
    mediaController.updateMedia
);

router.delete(
    '/:id',
    protect,
    authorize('creator'),
    mediaController.deleteMedia
);

module.exports = router;
