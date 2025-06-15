import React from 'react';
import UserIcon from '../../../svg/userIcon';

interface RecipeAuthorProps {
  name: string;
  email: string;
}

const AuthorInfo: React.FC<RecipeAuthorProps> = ({
  name,
  email,
}): JSX.Element => {
  return (
    <div className="flex items-center justify-end py-4 pr-6">
      <UserIcon className="w-10 h-10 mr-1" />
      <div className="text-sm">
        <p className="text-gray-900 leading-none">{name}</p>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  );
};

export default AuthorInfo;
