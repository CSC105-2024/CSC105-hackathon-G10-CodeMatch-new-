import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as collectionController from '../controller/collection.controller.js';

const collectionRoutes = new Hono();

collectionRoutes.use('*', authMiddleware);

collectionRoutes.get('/', collectionController.getAllUserCollections);
collectionRoutes.post('/', collectionController.addToCollection);
collectionRoutes.delete('/', collectionController.removeFromCollection);
collectionRoutes.delete('/clear', collectionController.clearCollection);

export default collectionRoutes;
