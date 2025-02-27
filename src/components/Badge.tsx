import React from 'react';
import { Badge as BadgeType } from '../types';

interface BadgeProps {
  badge: BadgeType;
}

const Badge: React.FC<BadgeProps> = ({ badge }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
        <img
          src={badge.image}
          alt={badge.name}
          className="w-12 h-12 object-contain"
        />
      </div>
      <h3 className="text-sm font-medium text-gray-900">{badge.name}</h3>
      <p className="text-xs text-gray-500 text-center mt-1">{badge.description}</p>
    </div>
  );
};

export default Badge;