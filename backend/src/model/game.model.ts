import { db } from '../index.js';

export const startNewGame = async (userId: number) => {
  await db.user.update({
    where: { id: userId },
    data: { liveScore: 0 },
  });
};

export const updateLiveGame = async (
  userId: number,
  isMatch: boolean
) => {
  const scoreDelta = isMatch ? 1 : -1;

  const user = await db.user.update({
    where: { id: userId },
    data: {
      liveScore: {
        increment: scoreDelta,
      },
    },
  });

  return user.liveScore;
};

export const endGame = async (userId: number) => {
  await db.user.update({
    where: { id: userId },
    data: { liveScore: 0 },
  });
};

export const getCardsByGameMode = async (gameModeId: number) => {
  return db.card.findMany({
    where: { gameModeId },
  });
};

export const getCardDetail = async (cardId: number) => {
  return db.card.findUnique({
    where: { id: cardId },
  });
};

export const isCardMatch = async (card1Id: number, card2Id: number) => {
  const [card1, card2] = await Promise.all([
    db.card.findUnique({ where: { id: card1Id } }),
    db.card.findUnique({ where: { id: card2Id } }),
  ]);

  if (!card1 || !card2) {
    throw new Error('Card not found');
  }
  
  return (
  card1.matchId === card2.id ||
    card2.matchId === card1.id
  );
};

