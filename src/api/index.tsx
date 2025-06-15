import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosRequestHeaders,
} from 'axios';

import getUserFromLocalStorage from '../utils/getUserFromLocalStorage';

// Attach token from localStorage to every request
const setBearerToken = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const user = getUserFromLocalStorage();
  if (user && user.token) {
    config.headers = Object.assign({}, config.headers, {
      Authorization: `Bearer ${user.token}`,
    }) as AxiosRequestHeaders;
  }
  return config;
};

// Axios instance with base URL
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

instance.interceptors.request.use(setBearerToken);

const register = async (
  data: RegisterApiPayload,
): Promise<AxiosResponse<RegisterApiResponse>> => {
  return await instance.post<RegisterApiResponse>('/auth/register', data);
};

const login = async (
  data: LoginParams,
): Promise<AxiosResponse<LoginApiResponse>> => {
  return await instance.post<LoginApiResponse>('/auth/signin', data);
};


const getAllRecipes = async (): Promise<AxiosResponse<RecipesApiResponse>> => {
  return await instance.get<RecipesApiResponse>('/recipes');
};

const getRecipeById = async (
  id: string,
): Promise<AxiosResponse<RecipeApiResponse>> => {
  return await instance.get<RecipeApiResponse>(`/recipes/${id}`);
};

const createRecipe = async (
  data: CreateRecipeParams,
): Promise<AxiosResponse<CreateOrUpdateRecipeApiResponse>> => {
  return await instance.post<CreateOrUpdateRecipeApiResponse>('/recipes', data);
};

const updateRecipe = async (
  id: string,
  data: Partial<CreateRecipeParams>,
): Promise<AxiosResponse<CreateOrUpdateRecipeApiResponse>> => {
  return await instance.patch<CreateOrUpdateRecipeApiResponse>(
    `/recipes/${id}`,
    data,
  );
};

const deleteRecipe = async (
  id: string,
): Promise<AxiosResponse<{ status: string; message: string }>> => {
  return await instance.delete(`/recipes/${id}`);
};

const getRecipesByTags = async (
  tags: string[],
): Promise<AxiosResponse<RecipesApiResponse>> => {
  const tagQuery = tags.join(',');
  return await instance.get<RecipesApiResponse>(`/recipes/filter/tags?tags=${tagQuery}`);
};

const addCommentToRecipe = async (
  id: string,
  text: string,
): Promise<AxiosResponse<RecipeApiResponse>> => {
  return await instance.post<RecipeApiResponse>(`/recipes/${id}/comment`, { text });
};

const saveRecipeToFavorites = async (
  id: string,
): Promise<AxiosResponse<{ status: string; message: string; payload: string[] }>> => {
  return await instance.post(`/recipes/${id}/save`);
};

export {
  register,
  login,
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesByTags,
  addCommentToRecipe,
  saveRecipeToFavorites,
};
