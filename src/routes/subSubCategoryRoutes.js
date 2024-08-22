// routes/subSubCategoryRoutes.js

const express = require('express');
const router = express.Router();
const subSubCategoryController = require('../controllers/SubSubCategoryController');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the JWT middleware

// Routes for sub-subcategory CRUD operations
router.get('/subsubcategories', subSubCategoryController.getAllSubSubCategories);
router.get('/subsubcategories/:id', subSubCategoryController.getSubSubCategoryById);
router.post('/subsubcategories', authenticateJWT, subSubCategoryController.createSubSubCategory);
router.put('/subsubcategories/:id', authenticateJWT, subSubCategoryController.updateSubSubCategory);
router.delete('/subsubcategories/:id', authenticateJWT, subSubCategoryController.deleteSubSubCategory);

module.exports = router;
