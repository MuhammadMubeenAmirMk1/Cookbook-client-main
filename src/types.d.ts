interface LocalStorageUserProps {
  userId: string;
  name: string;
  email: string;
  token: string;
  savedRecipes?: string[];
}

interface CookbookCreatorProps {
  name: string;
  email: string;
}

enum ApiStatus {
  Success = 'success',
  Error = 'error',
}
