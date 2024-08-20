// routes/categoryRoutes.js

const express = require('express');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the JWT middleware

const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/CategoryController');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories',authenticateJWT, createCategory);
router.put('/categories/:id', authenticateJWT,updateCategory);
router.delete('/categories/:id', authenticateJWT,deleteCategory);

module.exports = router;
