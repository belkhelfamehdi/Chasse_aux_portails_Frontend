import React, { type ReactNode } from 'react';

interface ModalProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    hideHeader?: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose, title, hideHeader }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/40">
            <div className="relative flex flex-col overflow-hidden bg-white rounded-xl shadow-xl max-h-[90vh] w-full max-w-lg mx-4">
                {/* Modal Header */}
                {!hideHeader && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h1 className="font-medium text-ynov-primary md:text-lg font-montserrat">{title}</h1>
                    </div>
                )}

                {/* Close Button */}
                <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:text-ynov-primary rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute top-3.5 right-3.5 cursor-pointer transition-colors"
                    onClick={onClose}
                >
                    <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                </button>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
