import React, { useState } from 'react';
import CreatorInfo from '../CreatorInfo';
import { toggleFavorite } from '../../../api';

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  imageUrl?: string;
  tags: string[];
  isFavorite: boolean;
  creator: {
    name: string;
    email: string;
  };
  onToggleFavorite: (updatedFavorites: string[]) => void;
}

const RecipeCard = ({
  id,
  title,
  description,
  ingredients,
  imageUrl,
  tags,
  isFavorite,
  creator,
  onToggleFavorite,
}: RecipeCardProps): JSX.Element => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  const handleToggleFavorite = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await toggleFavorite(id);
      const updatedFavorites = response.data.payload;

      setFavorite(updatedFavorites.includes(id));
      onToggleFavorite?.(updatedFavorites);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded bg-white overflow-hidden shadow-2xl relative">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}

      <button
        onClick={() => void handleToggleFavorite()}
        className="absolute top-2 right-2 text-2xl"
        disabled={loading}
        title={favorite ? 'Unfavorite' : 'Save to Favorites'}
      >
        {favorite ? '💖' : '🤍'}
      </button>

      <div className="flex justify-between items-center px-4 pt-4">
        <span className="text-xs rounded-full bg-indigo-500 px-2 py-1 text-white font-semibold">
          {tags.join(', ') || 'No Tags'}
        </span>
      </div>

      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 break-words">{title}</div>
        <p className="text-gray-700 text-base break-words">
          {description}
        </p>
        {ingredients.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            <strong>Ingredients:</strong> {ingredients.join(', ')}
          </p>
        )}
      </div>

      <CreatorInfo name={creator.name} email={creator.email} />
    </div>
  );
};

export default RecipeCard;
