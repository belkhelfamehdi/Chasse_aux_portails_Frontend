// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Types
export interface User {
    id: number;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    firstname?: string;
    lastname?: string;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface ApiError {
    error: string;
}

export interface CityData {
    nom: string;
    latitude: number;
    longitude: number;
    rayon: number;
    adminId?: number;
}

export interface POIData {
    nom: string;
    description: string;
    latitude: number;
    longitude: number;
    iconUrl: string;
    modelUrl: string;
    cityId: number;
}

export interface AdminData {
    firstname: string;
    lastname: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
}

// Generic API request function
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    const config: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData: ApiError = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Une erreur réseau est survenue');
    }
}

// Auth API
export const authAPI = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        return apiRequest<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    logout: async (): Promise<{ message: string }> => {
        return apiRequest<{ message: string }>('/auth/logout', {
            method: 'POST',
        });
    },

    refreshToken: async (): Promise<{ accessToken: string }> => {
        return apiRequest<{ accessToken: string }>('/auth/refresh', {
            method: 'POST',
        });
    },
};

// Cities API
export const citiesAPI = {
    getAll: async () => {
        return apiRequest('/cities');
    },

    create: async (cityData: CityData) => {
        return apiRequest('/cities', {
            method: 'POST',
            body: JSON.stringify(cityData),
        });
    },

    update: async (id: number, cityData: Partial<CityData>) => {
        return apiRequest(`/cities/${id}`, {
            method: 'PUT',
            body: JSON.stringify(cityData),
        });
    },

    delete: async (id: number) => {
        return apiRequest(`/cities/${id}`, {
            method: 'DELETE',
        });
    },
};

// POIs API
export const poisAPI = {
    getAll: async () => {
        return apiRequest('/pois');
    },

    create: async (poiData: POIData) => {
        return apiRequest('/pois', {
            method: 'POST',
            body: JSON.stringify(poiData),
        });
    },

    update: async (id: number, poiData: Partial<POIData>) => {
        return apiRequest(`/pois/${id}`, {
            method: 'PUT',
            body: JSON.stringify(poiData),
        });
    },

    delete: async (id: number) => {
        return apiRequest(`/pois/${id}`, {
            method: 'DELETE',
        });
    },
};

// Admins API
export const adminsAPI = {
    getAll: async () => {
        return apiRequest('/auth/users');
    },

    create: async (adminData: AdminData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(adminData),
        });
    },

    update: async (id: number, adminData: Partial<AdminData>) => {
        return apiRequest(`/auth/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(adminData),
        });
    },

    delete: async (id: number) => {
        return apiRequest(`/auth/users/${id}`, {
            method: 'DELETE',
        });
    },
};
