import React, { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';
import { getAllRecipes } from '../../api';
import getUserFromLocalStorage from '../../utils/getUserFromLocalStorage';

interface Recipe {
  _id: string;
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

const HomePage = (): JSX.Element => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecipes = async (): Promise<void> => {
      try {
        const response = await getAllRecipes();
        const allRecipes = response.data.payload;
        setRecipes(allRecipes);

        const user = getUserFromLocalStorage();
        if (user) {
          setFavoriteIds(user.savedRecipes ?? []);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes().catch((error) => {
      console.error('Error in useEffect:', error);
    });
  }, []);

  // Sort: Favorites first
  const sortedRecipes = [...recipes].sort((a, b) => {
    const aFav = favoriteIds.includes(a._id);
    const bFav = favoriteIds.includes(b._id);
    return Number(bFav) - Number(aFav); // true > false
  });

  return (
    <div className="bg-zinc-200 min-h-screen">
      <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {sortedRecipes.map(({ _id, title, steps, imageUrl, tags, author }) => (
          <RecipeCard
            key={_id}
            id={_id}
            title={title}
            description={steps}
            imageUrl={imageUrl}
            tags={tags}
            creator={author}
            isFavorite={favoriteIds.includes(_id)}
            onToggleFavorite ={(updatedFavorites: string[]) =>
              setFavoriteIds(updatedFavorites)
            }
          />
        ))}
      </div>
      <div className="flex justify-center pb-10">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <a href="/create-recipe">Create a New Recipe</a>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
