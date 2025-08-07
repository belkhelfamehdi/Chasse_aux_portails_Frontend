import React from 'react';

interface TextInputProps {
    label?: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    required?: boolean;
    type?: 'text' | 'email' | 'password' | 'number';
    disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    className = '',
    required = false,
    type = 'text',
    disabled = false
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={disabled}
                className={`w-full px-3 py-2 text-gray-600 placeholder-gray-400 transition-colors bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white ${
                    disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                }`}
            />
        </div>
    );
};

export default TextInput;
