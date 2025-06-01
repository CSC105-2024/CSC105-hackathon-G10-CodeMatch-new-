import type { Context } from 'hono';
import * as gameModel from '../model/game.model.js';

const startGame = async (c: Context) => {
  try {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ success: false, msg: 'Unauthorized' }, 401);
    }

    await gameModel.startNewGame(userId);
    return c.json({ success: true, msg: 'Game started' });
  } catch (e) {
    return c.json({ success: false, msg: `Error starting game: ${e}` }, 500);
  }
};

const updateGame = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const { card1Id, card2Id } = body;

    if (
      !userId ||
      typeof card1Id !== 'number' ||
      typeof card2Id !== 'number'
    ) {
      return c.json({ success: false, msg: 'Invalid input format' }, 400);
    }

    const isMatch = await gameModel.isCardMatch(card1Id, card2Id);
    const score = await gameModel.updateLiveGame(userId, isMatch);

    return c.json({ success: true, data: { score, isMatch } });
  } catch (e) {
    return c.json({ success: false, msg: `Error updating game: ${e}` }, 500);
  }
};


const finishGame = async (c: Context) => {
  try {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ success: false, msg: 'Unauthorized' }, 401);
    }

    await gameModel.endGame(userId);
    return c.json({ success: true, msg: 'Game finished and score reset' });
  } catch (e) {
    return c.json({ success: false, msg: `Error finishing game: ${e}` }, 500);
  }
};

const getCardsByGameMode = async (c: Context) => {
  try {
    const gameModeId = Number(c.req.query('gameModeId'));
    if (isNaN(gameModeId)) {
      return c.json({ success: false, msg: 'Invalid or missing gameModeId' }, 400);
    }

    const cards = await gameModel.getCardsByGameMode(gameModeId);
    return c.json({ success: true, data: cards });
  } catch (e) {
    return c.json({ success: false, msg: `Error: ${e}` }, 500);
  }
};

const getCardDetail = async (c: Context) => {
  try {
    const cardId = Number(c.req.param('cardId'));
    if (isNaN(cardId)) {
      return c.json({ success: false, msg: 'Invalid cardId' }, 400);
    }

    const card = await gameModel.getCardDetail(cardId);
    if (!card) {
      return c.json({ success: false, msg: 'Card not found' }, 404);
    }

    return c.json({ success: true, data: card });
  } catch (e) {
    return c.json({ success: false, msg: `Error: ${e}` }, 500);
  }
};

export {
  startGame,
  updateGame,
  finishGame,
  getCardsByGameMode,
  getCardDetail,
};

