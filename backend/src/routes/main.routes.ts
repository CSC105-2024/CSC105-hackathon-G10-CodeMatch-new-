import { Hono } from 'hono';
import userRoutes from './user.routes.js';
import gameRoutes from './game.routes.js';
import collectionRoutes from './collection.routes.js';

const routes = new Hono();

routes.route('/user', userRoutes);
routes.route('/game', gameRoutes);
routes.route('/collection', collectionRoutes);

export default routes;