'use client';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', isLoading = false, className = '', disabled, ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-300 active:scale-[0.95] disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer";
  const sizes = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-lg" ,xl:"px-9 py-5 text-lg"};
  const variants = {
    primary: "bg-gradient-to-r from-sats-orange-500 to-sats-orange-600 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.6)] hover:from-sats-orange-400 hover:to-sats-orange-500 hover:-translate-y-0.5",
    secondary: "bg-sats-black-800 text-gray-100 border border-sats-black-700 hover:bg-sats-black-700 hover:border-sats-orange-500/50 hover:text-white hover:-translate-y-0.5",
    ghost: "bg-transparent text-gray-200 hover:text-sats-orange-500 hover:bg-sats-orange-500/10",
  };

  return (
    <button className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`} disabled={disabled || isLoading} {...props}>
      {children}
    </button>
  );
};