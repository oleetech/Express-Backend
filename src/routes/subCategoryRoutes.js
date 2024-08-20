const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the JWT middleware

// Routes for subcategory CRUD operations
router.get('/subcategories', subCategoryController.getAllSubCategories);
router.get('/subcategories/:id', subCategoryController.getSubCategoryById);
router.post('/subcategories',authenticateJWT, subCategoryController.createSubCategory);
router.put('/subcategories/:id',authenticateJWT, subCategoryController.updateSubCategory);
router.delete('/subcategories/:id', authenticateJWT,subCategoryController.deleteSubCategory);

module.exports = router;
