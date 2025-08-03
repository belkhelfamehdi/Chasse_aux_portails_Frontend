import React, { useState, useRef } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    acceptedFormats?: string[];
    className?: string;
    label?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    acceptedFormats = ['OBJ', 'STL', 'FBX', 'MP4'],
    className = '',
    label = 'Chargez un Modèle',
    multiple = false,
    maxSize = 50
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File | null) => {
        if (file && maxSize && file.size > maxSize * 1024 * 1024) {
            alert(`File size should be less than ${maxSize}MB`);
            return;
        }
        setSelectedFile(file);
        onFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const getAcceptString = () => {
        return acceptedFormats.map(format => {
            switch (format.toLowerCase()) {
                case 'obj': return '.obj';
                case 'stl': return '.stl';
                case 'fbx': return '.fbx';
                case 'mp4': return '.mp4';
                default: return `.${format.toLowerCase()}`;
            }
        }).join(',');
    };

    return (
        <div className={`w-full ${className}`}>
            <button
                type="button"
                className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragOver 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-blue-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileDialog}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={getAcceptString()}
                    multiple={multiple}
                    onChange={handleFileInputChange}
                />
                
                <div className="flex flex-col items-center space-y-2">
                    {/* Cloud Upload Icon */}
                    <div className="text-teal-500">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M7 18C4.79086 18 3 16.2091 3 14C3 11.7909 4.79086 10 7 10C7.34784 10 7.68348 10.0517 8 10.1484C8.58312 7.34846 11.0817 5.25 14 5.25C17.3137 5.25 20 7.93629 20 11.25C20 11.4711 19.9883 11.6895 19.9656 11.9045C20.5924 12.5924 21 13.5074 21 14.5C21 16.433 19.433 18 17.5 18H7Z" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                            <path 
                                d="M12 11V16M12 11L10 13M12 11L14 13" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    
                    <div>
                        <span className="font-medium text-gray-700">{label}</span>
                        {selectedFile && (
                            <div className="mt-1 text-sm text-green-600">
                                Selected: {selectedFile.name}
                            </div>
                        )}
                    </div>
                    
                    <p className="text-xs text-gray-500">
                        Supported formats: {acceptedFormats.join(', ')}
                    </p>
                </div>
            </button>
        </div>
    );
};

export default FileUpload;
