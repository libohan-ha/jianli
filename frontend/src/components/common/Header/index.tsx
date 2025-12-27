import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../Button';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  showBackButton = false,
  onBack,
  actions,
}) => {
  const location = useLocation();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>返回</span>
          </button>
        )}

        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">
            简历优化
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {actions}
        {location.pathname === '/' && (
          <>
            <Button variant="ghost" size="sm">
              帮助
            </Button>
            <Button variant="ghost" size="sm">
              历史记录
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;