import React from "react";

interface ButtonProps {
    label: string;
    className?: string;
    onClick: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
    label, 
    className, 
    onClick, 
    disabled = false,
    type = 'button'
}) => {
    return (
        <button 
            type={type}
            onClick={onClick} 
            disabled={disabled}
            className={`bg-primary hover:bg-primary-light text-white text-sm font-normal py-2.5 px-4 rounded-lg shadow-lg transition-colors ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            } ${className || ""}`}
        >
            {label}
        </button>
    );
};

export default Button;
