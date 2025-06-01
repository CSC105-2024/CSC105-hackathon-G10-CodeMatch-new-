import { Axios } from '../utils/axiosInstance';

type Card = {
  id: number;
  detail: string;
  matchId?: number;
  gameModeId: number;
};

type CollectionItem = {
  id: number;
  card1: Card;
  card2: Card;
  gameModeId: number;
};

type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  msg?: string;
};

export const getAllUserCollections = async () => {
  try {
    const res = await Axios.get<ApiResponse<CollectionItem[]>>('/collection');
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Failed to fetch collection',
    };
  }
};

export const addToCollection = async (
  card1Id: number,
  card2Id: number,
  gameModeId: number
) => {
  try {
    const res = await Axios.post<ApiResponse<CollectionItem>>('/collection', {
      card1Id,
      card2Id,
      gameModeId,
    });
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Failed to add to collection',
    };
  }
};

export const removeFromCollection = async (
  card1Id: number,
  card2Id: number,
  gameModeId: number
) => {
  try {
    const res = await Axios.delete<ApiResponse<null>>('/collection', {
      data: { card1Id, card2Id, gameModeId },
    });
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Failed to remove from collection',
    };
  }
};

export const clearCollection = async () => {
  try {
    const res = await Axios.delete<ApiResponse<null>>('/collection/clear');
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Failed to clear collection',
    };
  }
};
