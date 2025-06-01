import { Hono } from 'hono';
import * as gameController from '../controller/game.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const gameRouter = new Hono();

gameRouter.use('*', authMiddleware);
gameRouter.post('/start', gameController.startGame);
gameRouter.patch('/update', gameController.updateGame);
gameRouter.post('/finish', gameController.finishGame);

gameRouter.get('/cards', gameController.getCardsByGameMode);
gameRouter.get('/card/:cardId', gameController.getCardDetail); 

export default gameRouter;
