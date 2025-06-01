import { Axios } from '../utils/axiosInstance';

type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  msg?: string;
};

export type Card = {
  id: number;
  detail: string;
  matchId?: number | null;
  gameModeId: number;
};

export type UpdateGameResponse = {
  score: number;
  isMatch: boolean;
};

export type LiveScoreResponse = {
  score: number;
};


export const startGame = async () => {
  try {
    const res = await Axios.post<ApiResponse<null>>('/game/start');
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Failed to start game',
    };
  }
};

export const updateGame = async (card1Id: number, card2Id: number) => {
  try {
    const res = await Axios.patch<ApiResponse<UpdateGameResponse>>('/game/update', {
      card1Id,
      card2Id,
    });
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Failed to update game',
    };
  }
};

export const finishGame = async () => {
  try {
    const res = await Axios.post<ApiResponse<null>>('/game/finish');
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Failed to finish game',
    };
  }
};

export const getCardsByGameMode = async (gameModeId: number) => {
  try {
    const res = await Axios.get<ApiResponse<Card[]>>(`/game/cards?gameModeId=${gameModeId}`);
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Failed to fetch cards',
    };
  }
};
//asd
export const getCardDetail = async (cardId: number) => {
  try {
    const res = await Axios.get<ApiResponse<Card>>(`/game/card/${cardId}`);
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Failed to fetch card detail',
    };
  }
};

