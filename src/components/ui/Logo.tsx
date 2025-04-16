import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center">
        <img 
          src="/images/Logo.png" 
          alt="MedicoCare Logo" 
          className="h-12 w-12 object-contain"
        />
        <span className="ml-3 text-2xl font-bold text-hospital-dark">
          MedicoCare
        </span>
        <span className="ml-1 text-2xl font-bold text-hospital-primary">
          Hospital
        </span>
      </div>
    </Link>
  );
};

export default Logo; 