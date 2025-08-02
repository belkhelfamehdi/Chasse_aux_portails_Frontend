import React, { useState, useRef } from 'react';

interface ProfilePictureUploadProps {
    onImageSelect: (file: File | null) => void;
    currentImage?: string; // URL or base64 string of current image
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    allowRemove?: boolean;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
    onImageSelect,
    currentImage,
    className = '',
    size = 'sm',
    allowRemove = true
}) => {
    const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    const handleFileSelect = (file: File | null) => {
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onImageSelect(file);
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

    const removeImage = () => {
        handleFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`flex flex-col items-center space-y-2 ${className}`}>
            <div className="relative">
                <button
                    type="button"
                    className={`${sizeClasses[size]} rounded-full border border-gray-300 overflow-hidden cursor-pointer transition-colors ${
                        isDragOver
                            ? 'border-gray-400 bg-gray-100'
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
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
                        accept="image/*"
                        onChange={handleFileInputChange}
                    />
                    
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                            {/* User Icon */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path 
                                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                            </svg>
                            {size === 'lg' && <span className="text-xs mt-1">Photo</span>}
                        </div>
                    )}
                </button>

                {/* Edit button overlay */}
                <button
                    type="button"
                    className="absolute bottom-0 right-3 bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                    onClick={openFileDialog}
                    title="Change photo"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <div className="flex space-x-2">
                
                {previewImage && allowRemove && (
                    <button
                        type="button"
                        onClick={removeImage}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                        Supprimer
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfilePictureUpload;
