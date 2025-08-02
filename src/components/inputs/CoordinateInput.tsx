import React from 'react';

interface CoordinateInputProps {
    latitudeValue: string;
    longitudeValue: string;
    onLatitudeChange: (value: string) => void;
    onLongitudeChange: (value: string) => void;
    className?: string;
    required?: boolean;
}

const CoordinateInput: React.FC<CoordinateInputProps> = ({
    latitudeValue,
    longitudeValue,
    onLatitudeChange,
    onLongitudeChange,
    className = '',
    required = false
}) => {
    return (
        <div className={`w-full ${className}`}>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <input
                        type="number"
                        step="any"
                        placeholder="Entrez Latitude"
                        value={latitudeValue}
                        onChange={(e) => onLatitudeChange(e.target.value)}
                        required={required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                    />
                </div>
                <div>
                    <input
                        type="number"
                        step="any"
                        placeholder="Entrez Longitude"
                        value={longitudeValue}
                        onChange={(e) => onLongitudeChange(e.target.value)}
                        required={required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                    />
                </div>
            </div>
        </div>
    );
};

export default CoordinateInput;
