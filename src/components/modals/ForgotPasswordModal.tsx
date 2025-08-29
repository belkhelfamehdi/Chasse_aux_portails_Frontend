import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { TextInput } from '../inputs';
import Button from '../Button';
import { useNotifications } from '../../contexts/useNotifications';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { success, error: showError } = useNotifications();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Implement actual password reset API call
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            setIsSuccess(true);
            success(
                'Email envoyé avec succès',
                `Un lien de réinitialisation a été envoyé à ${email}`
            );
        } catch {
            showError(
                'Erreur lors de l\'envoi',
                'Une erreur est survenue. Veuillez réessayer.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setIsSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
           fixed inset-0 z-50 overflow-y-auto justify-center min-h-screen px-flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0  <button
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacfixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 cursor-default            onKeyDown={(e) => e.key === 'Escape' && handleClose()}
                    aria-label="Fermer le modal"
                />

                {/* Modal */}
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xldiv className="flex items-center justify-between mb-4">
                    flex items-center justify-between mb-4 text-gray-900">
                          text-lg font-medium text-gray-900Mot de passe oublié'}
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
              text-gray-400 transition-colors hover:text-gray-500className="w-6 h-6" />
                        </button>
                    </dw-6 h-6                  {/* Content */}
                    {isSuccess ? (
                        <div className="text-center">
                            <div className="mx-auto flex itemtext-centerstify-center h-12 w-12 rounded-full bg-green-100flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-fullill="none" viewBox="0 0 24 24" stroke="currentColor"w-6 h-6 text-green-600                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-600 mb-6">
                                Un email avec les inmb-6 text-sm text-gray-600ser votre mot de passe a été envoyé à <strong>{email}</strong>.
                            </p>
                            <Button
                                label="Fermer"
                                onClick={handleClose}
                                className="w-full"
                            />
                        </div>
                 w-full (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
        space-y-4               Entrez votre adresse email et nmb-4 text-sm text-gray-600 pour réinitialiser votre mot de passe.
                            </p>

                            <TextInput
                                type="email"
                                placeholder="Votre adresse email"
                                value={email}
                                onChange={setEmail}
                                required
                                disabled={isLoading}
                            />

                            <div className="flex space-x-3">
                                <Button
                                    label="Annulflex space-x-3                          onClick={handleClose}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700"
                                    disabled={isLoading}
flex-1 text-gray-700 bg-gray-300 hover:bg-gray-400                 <Button
                                    type="submit"
                                    label={isLoading ? 'Envoi...' : 'Envoyer'}
                                    onClick={() => {}} // Form submission handled by onSubmit
                                    className="flex-1"
                                    disabled={!email || isLoading}
                                />
      flex-1                </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
