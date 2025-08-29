import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { useNotifications } from '../../contexts/useNotifications';
import { authAPI } from '../../services/api';
import Button from '../Button';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, CameraIcon } from '@heroicons/react/24/outline';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsContent: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [errors, setErrors] = useState<Partial<PasswordChangeData>>({});

  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (password.length < 6) {
      errors.push('Le mot de passe doit contenir au moins 6 caractères');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    return errors;
  };

  const handleInputChange = (field: keyof PasswordChangeData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<PasswordChangeData> = {};
    
    // Validate current password
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Le mot de passe actuel est requis';
    }
    
    // Validate new password
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else {
      const passwordValidationErrors = validatePassword(passwordData.newPassword);
      if (passwordValidationErrors.length > 0) {
        newErrors.newPassword = passwordValidationErrors[0];
      }
    }
    
    // Validate confirm password
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    // Check if new password is different from current
    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe doit être différent de l\'actuel';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the password change API
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      addNotification({
        type: 'success',
        title: 'Mot de passe modifié',
        message: 'Votre mot de passe a été modifié avec succès.'
      });
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Une erreur est survenue lors de la modification du mot de passe.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Veuillez sélectionner un fichier image valide.'
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Le fichier ne doit pas dépasser 5MB.'
      });
      return;
    }

    setIsUploadingPicture(true);

    try {
      const response = await authAPI.updateProfilePicture(file);
      
      addNotification({
        type: 'success',
        title: 'Photo de profil mise à jour',
        message: response.message
      });

      // Force page reload to update the profile picture everywhere
      window.location.reload();

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour de la photo de profil.'
      });
    } finally {
      setIsUploadingPicture(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-[#23b2a4] rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-montserrat">Paramètres</h1>
            <p className="text-gray-600 font-source-sans">Gérez vos paramètres de compte et votre sécurité</p>
          </div>
        </div>
      </div>

      {/* User Profile Info */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 font-montserrat">Informations du profil</h2>
        
        {/* Profile Picture Section */}
        <div className="flex items-center pb-6 mb-6 space-x-6 border-b border-gray-200">
          <div className="relative group">
            <div className="flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 rounded-full">
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt="Profil utilisateur"
                  className="object-cover w-full h-full"
                />
              ) : (
                <UserIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <button
              type="button"
              onClick={handleProfilePictureClick}
              disabled={isUploadingPicture}
              className="absolute inset-0 flex items-center justify-center transition-all duration-200 bg-black bg-opacity-0 rounded-full group-hover:bg-opacity-50"
            >
              <CameraIcon className="w-6 h-6 text-white transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 font-source-sans">Photo de profil</h3>
            <p className="text-sm text-gray-500 font-source-sans">Cliquez sur votre photo pour la modifier</p>
            <p className="mt-1 text-xs text-gray-400 font-source-sans">Format: PNG, JPG, JPEG, WEBP (max. 5MB)</p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
            
            {isUploadingPicture && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#23b2a4]"></div>
                  <span className="text-xs text-gray-500 font-source-sans">Téléchargement en cours...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* User Information Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <span className="block text-sm font-medium text-gray-700 font-source-sans">Prénom</span>
            <p className="mt-1 text-sm text-gray-900 font-source-sans">{user?.firstname || 'Non défini'}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700 font-source-sans">Nom</span>
            <p className="mt-1 text-sm text-gray-900 font-source-sans">{user?.lastname || 'Non défini'}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700 font-source-sans">Email</span>
            <p className="mt-1 text-sm text-gray-900 font-source-sans">{user?.email}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700 font-source-sans">Rôle</span>
            <p className="mt-1 text-sm text-gray-900 font-source-sans">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                user?.role === 'SUPER_ADMIN' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.role === 'SUPER_ADMIN' ? 'Super Administrateur' : 'Administrateur'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="flex items-center mb-6 space-x-2">
          <LockClosedIcon className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 font-montserrat">Changer le mot de passe</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 font-source-sans">
              Mot de passe actuel
            </label>
            <div className="relative mt-1">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                } rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#23b2a4] focus:border-[#23b2a4] sm:text-sm`}
                placeholder="Entrez votre mot de passe actuel"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-2 text-sm text-red-600 font-source-sans">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 font-source-sans">
              Nouveau mot de passe
            </label>
            <div className="relative mt-1">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.newPassword ? 'border-red-300' : 'border-gray-300'
                } rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#23b2a4] focus:border-[#23b2a4] sm:text-sm`}
                placeholder="Entrez votre nouveau mot de passe"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-600 font-source-sans">{errors.newPassword}</p>
            )}
            <div className="mt-2">
              <p className="text-xs text-gray-500 font-source-sans">
                Le mot de passe doit contenir au moins 6 caractères avec des lettres majuscules, minuscules et des chiffres.
              </p>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 font-source-sans">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative mt-1">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#23b2a4] focus:border-[#23b2a4] sm:text-sm`}
                placeholder="Confirmez votre nouveau mot de passe"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 font-source-sans">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              label={isLoading ? 'Modification en cours...' : 'Modifier le mot de passe'}
              onClick={() => {}} // Form submission is handled by onSubmit
              disabled={isLoading}
              className="w-full sm:w-auto bg-[#23b2a4] hover:bg-[#1a8a7f]"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsContent;
