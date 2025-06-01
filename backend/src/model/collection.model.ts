import { db } from '../index.js'

export const addToCollection = async (
  userId: number,
  card1Id: number,
  card2Id: number,
  gameModeId: number
) => {
  const card1 = await db.card.findUnique({ where: { id: card1Id } });
  const card2 = await db.card.findUnique({ where: { id: card2Id } });

  if (!card1 || !card2) {
    throw new Error('One or both cards not found');
  }

  return db.collection.create({
    data: {
      userId,
      card1Id,
      card2Id,
      gameModeId,
    },
  });
};

export const removeFromCollection = async (
  userId: number,
  card1Id: number,
  card2Id: number,
  gameModeId: number
) => {
  return db.collection.deleteMany({
    where: {
      userId,
      card1Id,
      card2Id,
      gameModeId,
    },
  });
};


export const clearUserCollection = async (userId: number) => {
  return db.collection.deleteMany({
    where: {
      userId,
    },
  });
};

export const getAllUserCollections = async (userId: number) => {
  return db.collection.findMany({
    where: {
      userId,
    },
    include: {
      card1: true,
      card2: true,
    },
  });
};
