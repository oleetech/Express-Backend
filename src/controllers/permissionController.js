require('reflect-metadata');
require('dotenv').config(); 

const AppDataSource = require('../config/database');
const { Permission } = require('../entities'); 

/**
 * Fetches all entities from the database and returns their names.
 * @function getAllEntities
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @returns {Promise<void>} - A promise that resolves to the list of entity names.
 */
const getAllEntities = async (req, res) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const entities = AppDataSource.entityMetadatas.map(metadata => metadata.name);

        res.status(200).json({ entities });
    } catch (error) {
        console.error('Error retrieving entities:', error);
        res.status(500).json({ message: 'Error retrieving entities', error });
    }
};
const createPermissionsForEntity = async (req, res) => {
    const { entityName } = req.params;

    try {
        // Get the permission repository
        const permissionRepository = AppDataSource.getRepository(Permission);

        // Define the actions for which permissions will be created
        const actions = ['create', 'read', 'update', 'delete', 'view'];

        // Array to hold permissions that need to be created
        const permissionsToCreate = [];

        // Iterate over each action and check if permission already exists
        for (const action of actions) {
            const permissionName = `${action}_${entityName}`;

            // Check if the permission already exists in the database
            const existingPermission = await permissionRepository.findOne({
                where: { name: permissionName },
            });

            // If permission does not exist, add it to the array of permissions to create
            if (!existingPermission) {
                permissionsToCreate.push({
                    name: permissionName,
                    model: entityName,
                    action: action,
                });
            }
        }

        // If there are permissions to create, save them to the database
        if (permissionsToCreate.length > 0) {
            await permissionRepository.save(permissionsToCreate);
            res.status(201).json({ message: `Permissions created for entity: ${entityName}` });
        } else {
            res.status(200).json({ message: `Permissions already exist for entity: ${entityName}` });
        }
    } catch (error) {
        // Log the error and send a response with status 500
        console.error('Error creating permissions:', error);
        res.status(500).json({ message: 'Error creating permissions', error });
    }
};

const createPermissionsForAllEntities = async (req, res) => {
    try {
        // Get the list of entity names
        const entities = AppDataSource.entityMetadatas.map(metadata => metadata.name);

        // Track results
        const results = [];

        // Iterate over each entity
        for (const entityName of entities) {
            const permissionRepository = AppDataSource.getRepository(Permission);

            // Get actions to be checked
            const actions = ['create', 'read', 'update', 'delete', 'view'];
            const permissionsToCreate = [];

            for (const action of actions) {
                const permissionName = `${action}_${entityName}`;

                const existingPermission = await permissionRepository.findOne({
                    where: { name: permissionName },
                });

                if (!existingPermission) {
                    permissionsToCreate.push({
                        name: permissionName,
                        model: entityName,
                        action: action,
                    });
                }
            }

            // Create permissions if they don't already exist
            if (permissionsToCreate.length > 0) {
                await permissionRepository.save(permissionsToCreate);
                results.push({ entityName, message: `Permissions created for entity: ${entityName}` });
            } else {
                results.push({ entityName, message: `Permissions already exist for entity: ${entityName}` });
            }
        }

        // Respond with results
        res.status(200).json({ message: 'Permissions processed for all entities', results });
    } catch (error) {
        console.error('Error creating permissions for all entities:', error);
        res.status(500).json({ message: 'Error creating permissions for all entities', error });
    }
};



module.exports = {
    getAllEntities,
    createPermissionsForEntity,
    createPermissionsForAllEntities,
};
