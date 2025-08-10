// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types
export interface User {
    id: number;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    firstname?: string;
    lastname?: string;
    profilePictureUrl?: string;
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
    iconUrl?: string;
    modelUrl?: string;
    iconFile?: File | null;
    modelFile?: File | null;
    cityId: number;
}

export interface AdminData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    cityIds: number[];
    profilePicture?: File | null;
}

// Generic API request function
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    const makeRequest = async (accessToken: string | null): Promise<Response> => {
        const config: RequestInit = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                ...options.headers,
            },
            ...options,
        };
        return fetch(url, config);
    };

    try {
        let response = await makeRequest(token);
        
        // If token is expired (403 or 401), try to refresh
        if ((response.status === 403 || response.status === 401) && token) {
            try {
                const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                });
                
                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    const newToken: string = refreshData.accessToken;
                    const refreshedUser: User | undefined = refreshData.user;
                    
                    // Update localStorage
                    localStorage.setItem('accessToken', newToken);
                    if (refreshedUser) {
                        localStorage.setItem('user', JSON.stringify(refreshedUser));
                    }

                    // Notify app about auth update
                    try {
                        window.dispatchEvent(new CustomEvent('auth:updated', { detail: { accessToken: newToken, user: refreshedUser } }));
                    } catch {
                        // Ignore dispatch errors
                    }
                    
                    // Retry the original request with new token
                    response = await makeRequest(newToken);
                } else {
                    // Refresh failed, clear auth data and redirect to login
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    throw new Error('Session expired. Please login again.');
                }
            } catch {
                // Refresh failed, clear auth data
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                throw new Error('Session expired. Please login again.');
            }
        }
        
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

// API request function for FormData (file uploads)
async function apiFormDataRequest<T>(
    endpoint: string,
    formData: FormData,
    method: 'POST' | 'PUT' = 'POST'
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    const config: RequestInit = {
        method,
        credentials: 'include',
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        body: formData,
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

    refreshToken: async (): Promise<{ accessToken: string; user?: User }> => {
        return apiRequest<{ accessToken: string; user?: User }>('/auth/refresh', {
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
        return apiRequest('/cities/create', {
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
        // If there are files to upload, use FormData
        if (poiData.iconFile || poiData.modelFile) {
            const formData = new FormData();
            formData.append('nom', poiData.nom);
            formData.append('description', poiData.description);
            formData.append('latitude', poiData.latitude.toString());
            formData.append('longitude', poiData.longitude.toString());
            formData.append('cityId', poiData.cityId.toString());
            
            if (poiData.iconFile) {
                formData.append('iconFile', poiData.iconFile);
            }
            if (poiData.modelFile) {
                formData.append('modelFile', poiData.modelFile);
            }
            
            return apiFormDataRequest('/pois/create', formData);
        } else {
            // For POIs without files, use JSON
            const poiDataWithoutFiles = {
                nom: poiData.nom,
                description: poiData.description,
                latitude: poiData.latitude,
                longitude: poiData.longitude,
                cityId: poiData.cityId,
                ...(poiData.iconUrl?.trim() && { iconUrl: poiData.iconUrl }),
                ...(poiData.modelUrl?.trim() && { modelUrl: poiData.modelUrl })
            };
            return apiRequest('/pois/create', {
                method: 'POST',
                body: JSON.stringify(poiDataWithoutFiles),
            });
        }
    },

    update: async (id: number, poiData: Partial<POIData>) => {
        // If there are files to upload, use FormData
        if (poiData.iconFile || poiData.modelFile) {
            const formData = new FormData();
            if (poiData.nom) formData.append('nom', poiData.nom);
            if (poiData.description) formData.append('description', poiData.description);
            if (poiData.latitude !== undefined) formData.append('latitude', poiData.latitude.toString());
            if (poiData.longitude !== undefined) formData.append('longitude', poiData.longitude.toString());
            if (poiData.cityId) formData.append('cityId', poiData.cityId.toString());
            
            if (poiData.iconFile) {
                formData.append('iconFile', poiData.iconFile);
            }
            if (poiData.modelFile) {
                formData.append('modelFile', poiData.modelFile);
            }
            
            return apiFormDataRequest(`/pois/${id}`, formData, 'PUT');
        } else {
            // For updates without files, use JSON
            const poiDataWithoutFiles = {
                ...(poiData.nom && { nom: poiData.nom }),
                ...(poiData.description && { description: poiData.description }),
                ...(poiData.latitude !== undefined && { latitude: poiData.latitude }),
                ...(poiData.longitude !== undefined && { longitude: poiData.longitude }),
                ...(poiData.cityId && { cityId: poiData.cityId }),
                ...(poiData.iconUrl && { iconUrl: poiData.iconUrl }),
                ...(poiData.modelUrl && { modelUrl: poiData.modelUrl })
            };
            return apiRequest(`/pois/${id}`, {
                method: 'PUT',
                body: JSON.stringify(poiDataWithoutFiles),
            });
        }
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
        return apiRequest('/admins');
    },

    getById: async (id: number) => {
        return apiRequest(`/admins/${id}`);
    },

    getStats: async () => {
        return apiRequest('/admins/stats');
    },

    create: async (adminData: AdminData) => {
        // If there's a profile picture, use FormData
        if (adminData.profilePicture) {
            const formData = new FormData();
            formData.append('firstname', adminData.firstname);
            formData.append('lastname', adminData.lastname);
            formData.append('email', adminData.email);
            formData.append('password', adminData.password);
            formData.append('role', adminData.role);
            formData.append('cityIds', JSON.stringify(adminData.cityIds));
            formData.append('profilePicture', adminData.profilePicture);
            
            return apiFormDataRequest('/admins', formData);
        } else {
            // For admins without profile pictures, use JSON
            const adminDataWithoutFile = {
                firstname: adminData.firstname,
                lastname: adminData.lastname,
                email: adminData.email,
                password: adminData.password,
                role: adminData.role,
                cityIds: adminData.cityIds
            };
            return apiRequest('/admins', {
                method: 'POST',
                body: JSON.stringify(adminDataWithoutFile),
            });
        }
    },

    update: async (id: number, adminData: Partial<AdminData>) => {
        // If there's a profile picture, use FormData
        if (adminData.profilePicture) {
            const formData = new FormData();
            if (adminData.firstname) formData.append('firstname', adminData.firstname);
            if (adminData.lastname) formData.append('lastname', adminData.lastname);
            if (adminData.email) formData.append('email', adminData.email);
            if (adminData.password) formData.append('password', adminData.password);
            if (adminData.role) formData.append('role', adminData.role);
            if (adminData.cityIds) formData.append('cityIds', JSON.stringify(adminData.cityIds));
            formData.append('profilePicture', adminData.profilePicture);
            
            return apiFormDataRequest(`/admins/${id}`, formData, 'PUT');
        } else {
            // For updates without profile pictures, use JSON
            const adminDataWithoutFile: Partial<AdminData> = {};
            if (adminData.firstname) adminDataWithoutFile.firstname = adminData.firstname;
            if (adminData.lastname) adminDataWithoutFile.lastname = adminData.lastname;
            if (adminData.email) adminDataWithoutFile.email = adminData.email;
            if (adminData.password) adminDataWithoutFile.password = adminData.password;
            if (adminData.role) adminDataWithoutFile.role = adminData.role;
            if (adminData.cityIds) adminDataWithoutFile.cityIds = adminData.cityIds;
            
            return apiRequest(`/admins/${id}`, {
                method: 'PUT',
                body: JSON.stringify(adminDataWithoutFile),
            });
        }
    },

    delete: async (id: number) => {
        return apiRequest(`/admins/${id}`, {
            method: 'DELETE',
        });
    },
};

