import type { Context } from 'hono';
import * as collectionModel from '../model/collection.model.js';

const addToCollection = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const { card1Id, card2Id, gameModeId } = body;

    if (!card1Id || !card2Id || !gameModeId) {
      return c.json({ success: false, msg: 'Missing card IDs or gameModeId' }, 400);
    }

    const added = await collectionModel.addToCollection(userId, card1Id, card2Id, gameModeId);
    return c.json({ success: true, data: added });
  } catch (e) {
    return c.json({ success: false, msg: `Error: ${e}` }, 500);
  }
};


const removeFromCollection = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const { card1Id, card2Id, gameModeId } = body;

    if (!card1Id || !card2Id || !gameModeId) {
      return c.json({ success: false, msg: 'Missing card IDs or gameModeId' }, 400);
    }

    await collectionModel.removeFromCollection(userId, card1Id, card2Id, gameModeId);
    return c.json({ success: true, msg: 'Removed successfully' });
  } catch (e) {
    return c.json({ success: false, msg: `Error: ${e}` }, 500);
  }
};


const clearCollection = async (c: Context) => {
  try {
    const userId = c.get('userId');
    await collectionModel.clearUserCollection(userId);
    return c.json({ success: true, msg: 'All items cleared from collection' });
  } catch (e) {
    return c.json({ success: false, msg: `Error: ${e}` }, 500);
  }
};

const getAllUserCollections = async (c: Context) => {
  try {
    const userId = c.get('userId');

    const items = await collectionModel.getAllUserCollections(userId);
    return c.json({ success: true, data: items });
  } catch (e) {
    return c.json({ success: false, msg: `Error: ${e}` }, 500);
  }
};


export {
  addToCollection,
  removeFromCollection,
  clearCollection,
  getAllUserCollections,
};
