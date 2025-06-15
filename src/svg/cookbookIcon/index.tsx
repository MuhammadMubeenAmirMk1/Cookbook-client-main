import React from 'react';

interface SVGProps {
  className?: string;
  width?: string;
  height?: string;
}

const CookbookIcon: React.FC<SVGProps> = ({
  className,
  width = '24',
  height = '24',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
      fill="currentColor"
      viewBox="0 0 512 512"
    >
      <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM312.6 ..." />
    </svg>
  );
};

export default CookbookIcon;
