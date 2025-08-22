import React from 'react';
import EmptyState from './EmptyState';
import { BuildingOfficeIcon, MapPinIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface SpecificEmptyStateProps {
    onAction?: () => void;
}

export const CitiesEmptyState: React.FC<SpecificEmptyStateProps> = ({ onAction }) => (
    <EmptyState
        icon={<BuildingOfficeIcon className="h-8 w-8 text-gray-400" />}
        title="Aucune ville configurée"
        description="Commencez par ajouter votre première ville pour créer des chasses aux trésors captivantes. Chaque ville peut contenir plusieurs points d'intérêt uniques."
        action={onAction ? {
            label: "Ajouter une ville",
            onClick: onAction
        } : undefined}
        illustration={
            <svg className="mx-auto h-24 w-24 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7l-8-5zM12 4.12L18.29 7 12 10.88 5.71 7 12 4.12zM4 8.29l7 4.55v7.31c-4.18-.5-7-3.85-7-7.86V8.29zm9 11.86v-7.31l7-4.55v3.85c0 4.01-2.82 7.36-7 7.86v.15z"/>
            </svg>
        }
    />
);

export const POIsEmptyState: React.FC<SpecificEmptyStateProps> = ({ onAction }) => (
    <EmptyState
        icon={<MapPinIcon className="h-8 w-8 text-gray-400" />}
        title="Aucun point d'intérêt"
        description="Ajoutez des points d'intérêt fascinants avec des modèles 3D, des descriptions et des coordonnées GPS pour enrichir l'expérience de chasse aux trésors."
        action={onAction ? {
            label: "Ajouter un POI",
            onClick: onAction
        } : undefined}
        illustration={
            <svg className="mx-auto h-24 w-24 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
        }
    />
);

export const AdminsEmptyState: React.FC<SpecificEmptyStateProps> = ({ onAction }) => (
    <EmptyState
        icon={<UserGroupIcon className="h-8 w-8 text-gray-400" />}
        title="Aucun administrateur"
        description="Gérez votre équipe en ajoutant des administrateurs avec différents niveaux d'accès pour maintenir et développer votre plateforme de chasse aux trésors."
        action={onAction ? {
            label: "Ajouter un administrateur",
            onClick: onAction
        } : undefined}
        illustration={
            <svg className="mx-auto h-24 w-24 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.002 2.002 0 0 0 18.06 7c-.8 0-1.54.5-1.85 1.26l-1.92 5.77c-.25.76.1 1.59.78 1.97l1.93.93V20h-2zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 5.17 11 6s.67 1.5 1.5 1.5zM5.5 6c.83 0 1.5-.67 1.5-1.5S6.33 3 5.5 3 4 3.67 4 4.5 4.67 6 5.5 6zm2.5 15v-7h2.5l-2.54-7.63A2.002 2.002 0 0 0 5.56 5c-.8 0-1.54.5-1.85 1.26L1.78 12.03c-.25.76.1 1.59.78 1.97L4.5 15v6H8z"/>
            </svg>
        }
    />
);

export const SettingsEmptyState: React.FC = () => (
    <EmptyState
        icon={<Cog6ToothIcon className="h-8 w-8 text-gray-400" />}
        title="Paramètres à venir"
        description="Cette section contiendra bientôt tous les paramètres de configuration de votre plateforme de chasse aux trésors."
        illustration={
            <svg className="mx-auto h-24 w-24 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
            </svg>
        }
    />
);

export const SearchEmptyState: React.FC<{ searchTerm: string }> = ({ searchTerm }) => (
    <EmptyState
        icon={
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        }
        title="Aucun résultat trouvé"
        description={`Aucun élément ne correspond à votre recherche "${searchTerm}". Essayez avec d'autres mots-clés ou vérifiez l'orthographe.`}
        illustration={
            <svg className="mx-auto h-24 w-24 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
        }
    />
);

export const ErrorEmptyState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
    <EmptyState
        icon={
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
        }
        title="Erreur de chargement"
        description="Une erreur s'est produite lors du chargement des données. Veuillez réessayer dans quelques instants."
        action={onRetry ? {
            label: "Réessayer",
            onClick: onRetry,
            icon: (
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            )
        } : undefined}
    />
);
