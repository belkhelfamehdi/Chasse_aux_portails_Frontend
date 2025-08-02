import React from 'react';

interface TextAreaProps {
    label?: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    required?: boolean;
    rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
    label,
    placeholder,
    value,
    onChange,
    className = '',
    required = false,
    rows = 4
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                rows={rows}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors resize-vertical"
            />
        </div>
    );
};

export default TextArea;
