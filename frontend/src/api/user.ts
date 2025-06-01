import { Axios } from '../utils/axiosInstance';

type User = {
  id: number;
  username: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  msg?: string;
};

export const signupUser = async (username: string, password: string) => {
  try {
    const res = await Axios.post<ApiResponse<User>>('/user/signup', { username, password });
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Signup failed',
    };
  }
};

export const loginUser = async (
  username: string,
  password: string,
  remember?: boolean
) => {
  try {
    const res = await Axios.post<ApiResponse<User>>('/user/login', {
      username,
      password,
      remember,
    });
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Login failed',
    };
  }
};

export const logoutUser = async () => {
  try {
    const res = await Axios.post<ApiResponse<null>>('/user/logout');
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Logout failed',
    };
  }
};

export const getMe = async () => {
  try {
    const res = await Axios.get<ApiResponse<User>>('/user/me');
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.response?.data?.msg || 'Failed to fetch user info',
    };
  }
};
