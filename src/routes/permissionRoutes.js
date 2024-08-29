const express = require('express');
const {
    getAllEntities,
    createPermissionsForEntity,
    createPermissionsForAllEntities
} = require('../controllers/permissionController'); 

const router = express.Router();

// Route to get all entities
router.get('/entities', getAllEntities);

// Route to create permissions for a specific entity
router.post('/create-permissions/:entityName', createPermissionsForEntity);

// Route to create permissions for all entities
router.post('/create-permissions', createPermissionsForAllEntities);

module.exports = router;
