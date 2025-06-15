import React, { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';
import { getAllRecipes } from '../../api';

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

const HomePage = (): JSX.Element => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async (): Promise<void> => {
      try {
        const response = await getAllRecipes();
        setRecipes(response.data.payload);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes().catch((error) => {
      console.error('Error in useEffect:', error);
    });
  }, []);

  return (
    <div className="bg-zinc-200 h-full">
      <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {recipes.map(({ _id, title, steps, imageUrl, tags, author }) => (
          <RecipeCard
            key={_id}
            id={_id}
            title={title}
            description={steps} // Using steps as the summary/description
            imageUrl={imageUrl}
            tags={tags}
            creator={author}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <a href="/create-recipe">Create a New Recipe</a>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
