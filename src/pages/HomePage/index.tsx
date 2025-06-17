import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import { getAllRecipes } from '../../api';
import getUserFromLocalStorage from '../../utils/getUserFromLocalStorage';
import TagFilterDropdown from '../../components/tagfilterdropdown';

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
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q')?.toLowerCase() || '';
  const selectedTags = queryParams.get('tags')?.split(',').filter(Boolean) ?? [];

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    const params = new URLSearchParams(location.search);
    if (newQuery) params.set('q', newQuery);
    else params.delete('q');
    navigate({ search: params.toString() });
  };

  const handleTagChange = (newTags: string[]) => {
    const params = new URLSearchParams(location.search);
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
    }
    navigate({ search: params.toString() });
  };

  const allTags = Array.from(new Set(recipes.flatMap((r) => r.tags))).filter(Boolean);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesQuery =
      recipe.title.toLowerCase().includes(searchQuery) ||
      recipe.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery)) ||
      recipe.steps.toLowerCase().includes(searchQuery);

    const matchesTags =
      selectedTags.length === 0 ||
      (recipe.tags.length === 0 && selectedTags.length === 0) ||
      selectedTags.every((tag) => recipe.tags.includes(tag));

    return matchesQuery && matchesTags;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    const aFav = favoriteIds.includes(a._id);
    const bFav = favoriteIds.includes(b._id);
    return Number(bFav) - Number(aFav);
  });

  return (
    <div className="bg-zinc-200 min-h-screen px-4">
      <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-4">
        <input
          type="text"
          placeholder="Search recipes..."
          defaultValue={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-1/2 px-4 py-2 border rounded"
        />

        <TagFilterDropdown
          availableTags={allTags}
          selectedTags={selectedTags}
          onChange={handleTagChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {sortedRecipes.map(({ _id, title, ingredients, steps, imageUrl, tags, author }) => (
          <RecipeCard
            key={_id}
            id={_id}
            title={title}
            ingredients={ingredients}
            description={steps}
            imageUrl={imageUrl}
            tags={tags}
            creator={author}
            isFavorite={favoriteIds.includes(_id)}
            onToggleFavorite={(updatedFavorites: string[]) =>
              setFavoriteIds(updatedFavorites)
            }
          />
        ))}
      </div>

      <div className="flex justify-center pb-10 mt-10">
        <a
          href="/create-recipe"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create a New Recipe
        </a>
      </div>
    </div>
  );
};

export default HomePage;
