import React from "react";

interface ButtonProps {
    label: string;
    className?: string;
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, className, onClick }) => {
    return (
        <button onClick={onClick} className={`bg-primary hover:bg-primary-light text-white text-lg font-normal py-2.5 px-4 rounded-lg shadow-lg transition-colors cursor-pointer ${className || ""}`}>
            {label}
        </button>
    );
};

export default Button;
