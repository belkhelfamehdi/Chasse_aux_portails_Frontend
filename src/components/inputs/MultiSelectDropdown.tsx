import React, { useState, useRef, useEffect } from 'react';

interface Option {
    value: string | number;
    label: string;
}

interface MultiSelectDropdownProps {
    options: Option[];
    selectedValues: (string | number)[];
    onChange: (values: (string | number)[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    className?: string;
    required?: boolean;
    label?: string;
    disabled?: boolean;
    maxHeight?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    options,
    selectedValues,
    onChange,
    placeholder = 'Sélectionnez des options',
    searchPlaceholder = 'Rechercher...',
    className = '',
    required = false,
    label,
    disabled = false,
    maxHeight = '240px'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOptions = options.filter(option => 
        selectedValues.includes(option.value)
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleToggleOption = (optionValue: string | number) => {
        if (disabled) return;
        
        const isSelected = selectedValues.includes(optionValue);
        
        if (isSelected) {
            // Remove from selection
            onChange(selectedValues.filter(value => value !== optionValue));
        } else {
            // Add to selection
            onChange([...selectedValues, optionValue]);
        }
    };

    const handleRemoveOption = (optionValue: string | number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        onChange(selectedValues.filter(value => value !== optionValue));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) {
                setIsOpen(!isOpen);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
        }
    };



    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            
            <button
                type="button"
                className={`flex items-center justify-between w-full px-3 py-3 text-left text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    disabled 
                        ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                        : 'bg-white hover:border-gray-400'
                }`}
                style={{
                    borderColor: '#e5e7eb',
                    backgroundColor: disabled ? '#f9fafb' : 'white',
                    color: selectedOptions.length > 0 ? '#1f2937' : '#9ca3af'
                }}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                disabled={disabled}
            >
                <div className="flex flex-wrap items-center gap-1 flex-1 min-h-[20px]">
                    {selectedOptions.length === 0 && (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                    {selectedOptions.length > 0 && selectedOptions.length <= 3 && (
                        selectedOptions.map((option) => (
                            <span
                                key={option.value}
                                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
                            >
                                {option.label}
                                <button
                                    type="button"
                                    className="ml-1 hover:text-blue-600"
                                    onClick={(e) => handleRemoveOption(option.value, e)}
                                    disabled={disabled}
                                >
                                    ×
                                </button>
                            </span>
                        ))
                    )}
                    {selectedOptions.length > 3 && (
                        <span className="text-gray-700">
                            {selectedOptions.length} villes sélectionnées
                        </span>
                    )}
                </div>
                <svg
                    className={`w-4 h-4 transition-transform ml-2 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && !disabled && (
                <div 
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                    style={{ maxHeight }}
                >
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-200">
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Options List */}
                    <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                        {filteredOptions.length > 0 ? (
                            <div className="py-1">
                                {filteredOptions.map((option) => {
                                    const isSelected = selectedValues.includes(option.value);
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center justify-between ${
                                                isSelected ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                                            }`}
                                            onClick={() => handleToggleOption(option.value)}
                                        >
                                            <span>{option.label}</span>
                                            {isSelected && (
                                                <svg
                                                    className="w-4 h-4 text-blue-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-3 py-4 text-sm text-gray-500 text-center">
                                Aucune option trouvée
                            </div>
                        )}
                    </div>

                    {/* Selected Count Footer */}
                    {selectedOptions.length > 0 && (
                        <div className="px-3 py-2 border-t border-gray-200 text-xs text-gray-600 bg-gray-50">
                            {selectedOptions.length} ville{selectedOptions.length > 1 ? 's' : ''} sélectionnée{selectedOptions.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
