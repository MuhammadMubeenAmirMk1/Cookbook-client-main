import React from 'react';
import CreatorInfo from '../CreatorInfo';

interface RecipeCardProps {
  id: string;
  title: string;
  description: string; // use `steps` or summarized content
  imageUrl?: string;
  tags: string[];
  creator: {
    name: string;
    email: string;
  };
}

const RecipeCard = ({
  title,
  description,
  imageUrl,
  tags,
  creator,
}: RecipeCardProps): JSX.Element => {
  return (
    <div className="rounded bg-white overflow-hidden shadow-2xl">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="flex justify-between items-center px-4 pt-4">
        <span className="text-xs rounded-full bg-indigo-500 px-2 py-1 text-white font-semibold">
          {tags.join(', ') || 'No Tags'}
        </span>
      </div>

      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 break-words">{title}</div>
        <p className="text-gray-700 text-base break-words">{description}</p>
      </div>

      <CreatorInfo name={creator.name} email={creator.email} />
    </div>
  );
};

export default RecipeCard;
