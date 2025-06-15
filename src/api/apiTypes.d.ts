// Used for registering a user
interface RegisterApiPayload {
  name: string;
  email: string;
  password: string;
}

interface RegisterApiResponse {
  status: ApiStatus;
  message: string;
  payload: { token: string };
}

interface LoginParams {
  email: string;
  password: string;
}

interface LoginApiResponse {
  status: ApiStatus;
  message: string;
  payload: { token: string };
}


interface Recipe {
  _id: string; // MongoDB's unique ID
  title: string;
  ingredients: string[];
  steps: string;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  comments: {
    user: {
      _id: string;
      name: string;
      email: string;
    };
    text: string;
    date: string;
  }[];
}

interface RecipesApiResponse {
  status: ApiStatus;
  message: string;
  payload: Recipe[];
}

interface RecipeApiResponse {
  status: ApiStatus;
  message: string;
  payload: Recipe;
}

interface CreateRecipeParams {
  title: string;
  ingredients: string[];
  steps: string;
  tags?: string[];
  imageUrl?: string;
  author?: string;
}

interface CreateOrUpdateRecipeApiResponse {
  status: ApiStatus;
  message: string;
  payload: Recipe;
}

interface AddCommentParams {
  id: string;
  text: string;
}

interface FilterByTagsParams {
  tags: string[];
}
