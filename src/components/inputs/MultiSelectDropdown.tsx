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

    // Filter options based on search term and exclude already selected options
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedValues.includes(option.value)
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

        // Since filtered options exclude selected items, we only need to add
        const isSelected = selectedValues.includes(optionValue);

        if (!isSelected) {
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

            {/* Selected options display area */}
            {selectedOptions.length > 0 && (
                <div className="mb-2 p-2 border rounded-lg bg-gray-50 min-h-[40px] flex flex-wrap gap-1">
                    {selectedOptions.map((option) => (
                        <span
                            key={option.value}
                            className="inline-flex items-center px-2 py-1 text-xs bg-white border rounded-lg text-secondary whitespace-nowrap"
                        >
                            {option.label}
                            <button
                                type="button"
                                className="flex items-center justify-center w-4 h-4 ml-1 text-gray-400 rounded-full hover:text-red-500 focus:outline-none hover:bg-red-50"
                                onClick={(e) => handleRemoveOption(option.value, e)}
                                disabled={disabled}
                                aria-label={`Remove ${option.label}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Dropdown trigger button */}
            <button
                type="button"
                className={`flex items-center justify-between w-full px-3 py-3 text-left text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${disabled
                        ? 'opacity-50 cursor-not-allowed bg-gray-50'
                        : 'bg-white hover:border-gray-400'
                    }`}
                style={{
                    borderColor: '#e5e7eb',
                    backgroundColor: disabled ? '#f9fafb' : 'white',
                    color: selectedOptions.length > 0 ? '#1f2937' : '#9ca3af',
                    minHeight: '44px'
                }}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                disabled={disabled}
            >
                <span className="text-gray-500">
                    {(() => {
                        if (selectedOptions.length > 0) {
                            const itemText = selectedOptions.length === 1 ? 'item' : 'items';
                            return `${selectedOptions.length} ${itemText} selected`;
                        }
                        return placeholder;
                    })()}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ml-2 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
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
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                                {filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                                        onClick={() => handleToggleOption(option.value)}
                                    >
                                        <span>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-3 py-4 text-sm text-center text-gray-500">
                                {selectedValues.length === options.length ?
                                    'Toutes les options sont sélectionnées' :
                                    'Aucune option trouvée'
                                }
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
