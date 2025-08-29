/**
 * API client utilities and typed endpoints for the frontend.
 * - Centralizes token handling (read/write, refresh, and propagation).
 * - Provides JSON and multipart helpers using Axios.
 * - Includes JSDoc to generate documentation.
 */

import axios from 'axios';

// Base configuration
/**
 * Base URL for the backend API.
 * Reads from VITE_API_URL and falls back to http://localhost:3000/api
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configure Axios defaults
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// =========================
// Types
// =========================

/** Authenticated user shape returned by the backend. */
export interface User {
    id: number;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    firstname?: string;
    lastname?: string;
    profilePictureUrl?: string;
}

/** Response body returned by /auth/login (and refresh). */
export interface LoginResponse {
    accessToken: string;
    user: User;
}

/** Generic error payload returned by the backend. */
export interface ApiError {
    error: string;
}

/** City payload used in create/update operations. */
export interface CityData {
    nom: string;
    latitude: number;
    longitude: number;
    rayon: number;
    adminId?: number;
}

/**
 * Point Of Interest payload for create/update operations.
 * Note: Backend currently accepts JSON only for iconUrl/modelUrl (no multipart for POIs).
 */
export interface POIData {
    nom: string;
    description: string;
    latitude: number;
    longitude: number;
    iconUrl?: string;
    modelUrl?: string;
    iconFile?: File | null; // not used by backend currently
    modelFile?: File | null; // not used by backend currently
    cityId: number;
}

/** Admin payload for create/update operations. */
export interface AdminData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    cityIds: number[];
    profilePicture?: File | null;
}

// =========================
// Internal helpers
// =========================

/** Returns the access token from localStorage or sessionStorage. */
function getStoredToken(): string | null {
    return localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken');
}

/** Writes the access token and optional user to both storages and dispatches an auth event. */
function setStoredAuth(accessToken: string, user?: User) {
    localStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('accessToken', accessToken);
    if (user) {
        const userStr = JSON.stringify(user);
        localStorage.setItem('user', userStr);
        sessionStorage.setItem('user', userStr);
    }
    try {
        window.dispatchEvent(new CustomEvent('auth:updated', { detail: { accessToken, user } }));
    } catch {
        // ignore
    }
}

/** Clears auth data and redirects to login. */
function clearAuthAndRedirect() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
}

// =========================
// Axios Interceptors
// =========================

// Request interceptor to add token to headers
apiClient.interceptors.request.use(
    (config) => {
        const token = getStoredToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(new Error(error.message || 'Request error'))
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
                    withCredentials: true,
                });
                
                const { accessToken, user } = refreshResponse.data;
                setStoredAuth(accessToken, user);
                
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch {
                clearAuthAndRedirect();
                return Promise.reject(new Error('Session expired. Please login again.'));
            }
        }
        
        return Promise.reject(new Error(error.message || 'An error occurred'));
    }
);

// =========================
// Public HTTP helpers
// =========================

/**
 * Generic JSON API request helper using Axios.
 * - Automatically attaches Authorization header if an access token is present.
 * - On 401, auto-attempts a refresh then retries once.
 *
 * @template T Expected JSON response type
 * @param endpoint API endpoint, e.g. "/cities"
 * @param options Axios request config
 */
async function apiRequest<T>(endpoint: string, options: Record<string, unknown> = {}): Promise<T> {
    try {
        const response = await apiClient({
            url: endpoint,
            ...options,
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { error?: string } } };
            if (axiosError.response?.data?.error) {
                throw new Error(axiosError.response.data.error);
            }
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An error occurred');
    }
}

/**
 * API request helper for multipart/form-data uploads using Axios.
 * Automatically adds Authorization header when available.
 *
 * @template T Expected JSON response type
 * @param endpoint API endpoint, e.g. "/admins"
 * @param formData FormData payload to send
 * @param method HTTP method, defaults to POST
 */
async function apiFormDataRequest<T>(
    endpoint: string,
    formData: FormData,
    method: 'POST' | 'PUT' = 'POST'
): Promise<T> {
    try {
        const response = await apiClient({
            url: endpoint,
            method,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { error?: string } } };
            if (axiosError.response?.data?.error) {
                throw new Error(axiosError.response.data.error);
            }
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An error occurred');
    }
}

// =========================
// API groups
// =========================

/** Auth endpoints */
export const authAPI = {
    /** Login with email/password. */
    login: (email: string, password: string): Promise<LoginResponse> =>
        apiRequest<LoginResponse>('/auth/login', {
            method: 'POST',
            data: { email, password },
        }),

    /** Logout current session. */
    logout: (): Promise<{ message: string }> =>
        apiRequest<{ message: string }>('/auth/logout', { method: 'POST' }),

    /** Request a new access token using the refresh cookie. */
    refreshToken: (): Promise<{ accessToken: string; user?: User }> =>
        apiRequest<{ accessToken: string; user?: User }>('/auth/refresh', { method: 'POST' }),

    /** Change password for the current user. */
    changePassword: (passwordData: { currentPassword: string; newPassword: string }): Promise<{ message: string }> =>
        apiRequest<{ message: string }>('/auth/change-password', {
            method: 'PUT',
            data: passwordData,
        }),

    /** Update profile picture for the current user. */
    updateProfilePicture: (file: File): Promise<{ message: string; user: User }> => {
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        return apiRequest<{ message: string; user: User }>('/auth/profile-picture', {
            method: 'PUT',
            data: formData,
        });
    },
};

/** Cities endpoints */
export const citiesAPI = {
    /** Get all cities. */
    getAll: () => apiRequest('/cities'),

    /** Get cities assigned to the current admin. */
    getAdminCities: () => apiRequest('/cities/admin'),

    /** Get a city by id. */
    getById: (id: number) => apiRequest(`/cities/${id}`),

    /** Create a city. */
    create: (cityData: CityData) =>
        apiRequest('/cities/create', { method: 'POST', data: cityData }),

    /** Update a city by id. */
    update: (id: number, cityData: Partial<CityData>) =>
        apiRequest(`/cities/${id}`, { method: 'PUT', data: cityData }),

    /** Update a city by id as admin (limited permissions). */
    updateAsAdmin: (id: number, cityData: Partial<CityData>) =>
        apiRequest(`/cities/admin/${id}`, { method: 'PUT', data: cityData }),

    /** Delete a city by id. */
    delete: (id: number) => apiRequest(`/cities/${id}`, { method: 'DELETE' }),
};

/** Points Of Interest endpoints */
export const poisAPI = {
    /** Get all POIs. */
    getAll: () => apiRequest('/pois'),

    /** Get POIs assigned to the current admin. */
    getAdminPOIs: () => apiRequest('/pois/admin'),

    /** Get POIs by city id. */
    getByCity: (cityId: number) => apiRequest(`/pois/city/${cityId}`),

    /** Create a POI with file upload support for icons and 3D models. */
    create: (poiData: POIData) => {
        // Check if we have files to upload
        const hasFiles = poiData.iconFile || poiData.modelFile;
        
        if (hasFiles) {
            // Use multipart form data for file uploads
            const formData = new FormData();
            formData.append('nom', poiData.nom);
            formData.append('description', poiData.description);
            formData.append('latitude', poiData.latitude.toString());
            formData.append('longitude', poiData.longitude.toString());
            formData.append('cityId', poiData.cityId.toString());
            
            if (poiData.iconFile) {
                formData.append('iconFile', poiData.iconFile);
            } else if (poiData.iconUrl) {
                formData.append('iconUrl', poiData.iconUrl);
            }
            
            if (poiData.modelFile) {
                formData.append('modelFile', poiData.modelFile);
            } else if (poiData.modelUrl) {
                formData.append('modelUrl', poiData.modelUrl);
            }
            
            return apiFormDataRequest('/pois/create', formData, 'POST');
        } else {
            // Use JSON for URL-only POIs
            const payload = filterUndefined({
                nom: poiData.nom,
                description: poiData.description,
                latitude: poiData.latitude,
                longitude: poiData.longitude,
                cityId: poiData.cityId,
                iconUrl: trimOrUndefined(poiData.iconUrl),
                modelUrl: trimOrUndefined(poiData.modelUrl),
            });
            return apiRequest('/pois/create', { method: 'POST', data: payload });
        }
    },

    /** Create a POI as admin with file upload support for icons and 3D models. */
    createAsAdmin: (poiData: POIData) => {
        // Check if we have files to upload
        const hasFiles = poiData.iconFile || poiData.modelFile;
        
        if (hasFiles) {
            // Use multipart form data for file uploads
            const formData = new FormData();
            formData.append('nom', poiData.nom);
            formData.append('description', poiData.description);
            formData.append('latitude', poiData.latitude.toString());
            formData.append('longitude', poiData.longitude.toString());
            formData.append('cityId', poiData.cityId.toString());
            
            if (poiData.iconFile) {
                formData.append('iconFile', poiData.iconFile);
            } else if (poiData.iconUrl) {
                formData.append('iconUrl', poiData.iconUrl);
            }
            
            if (poiData.modelFile) {
                formData.append('modelFile', poiData.modelFile);
            } else if (poiData.modelUrl) {
                formData.append('modelUrl', poiData.modelUrl);
            }
            
            return apiFormDataRequest('/pois/admin/create', formData, 'POST');
        } else {
            // Use JSON for URL-only POIs
            const payload = filterUndefined({
                nom: poiData.nom,
                description: poiData.description,
                latitude: poiData.latitude,
                longitude: poiData.longitude,
                cityId: poiData.cityId,
                iconUrl: trimOrUndefined(poiData.iconUrl),
                modelUrl: trimOrUndefined(poiData.modelUrl),
            });
            return apiRequest('/pois/admin/create', { method: 'POST', data: payload });
        }
    },

    /** Update a POI by id (JSON only). */
    update: (id: number, poiData: Partial<POIData>) => {
        const payload = filterUndefined({
            nom: poiData.nom,
            description: poiData.description,
            latitude: poiData.latitude,
            longitude: poiData.longitude,
            cityId: poiData.cityId,
            iconUrl: poiData.iconUrl,
            modelUrl: poiData.modelUrl,
        });
        return apiRequest(`/pois/${id}`, { method: 'PUT', data: payload });
    },

    /** Update a POI by id as admin (JSON only). */
    updateAsAdmin: (id: number, poiData: Partial<POIData>) => {
        const payload = filterUndefined({
            nom: poiData.nom,
            description: poiData.description,
            latitude: poiData.latitude,
            longitude: poiData.longitude,
            cityId: poiData.cityId,
            iconUrl: poiData.iconUrl,
            modelUrl: poiData.modelUrl,
        });
        return apiRequest(`/pois/admin/${id}`, { method: 'PUT', data: payload });
    },

    /** Delete a POI by id. */
    delete: (id: number) => apiRequest(`/pois/${id}`, { method: 'DELETE' }),

    /** Delete a POI by id as admin. */
    deleteAsAdmin: (id: number) => apiRequest(`/pois/admin/${id}`, { method: 'DELETE' }),
};

/** Admins endpoints */
export const adminsAPI = {
    /** Get all admins (SUPER_ADMIN only). */
    getAll: () => apiRequest('/admins'),

    /** Get an admin by id. */
    getById: (id: number) => apiRequest(`/admins/${id}`),

    /** Get admin stats (counts, etc.). */
    getStats: () => apiRequest('/admins/stats'),

    /** Create an admin. Uses multipart when a profile picture is provided; otherwise JSON. */
    create: (adminData: AdminData) => {
        if (adminData.profilePicture) {
            return apiFormDataRequest('/admins', buildAdminFormData(adminData));
        }
        return apiRequest('/admins', {
            method: 'POST',
            data: buildAdminJson(adminData),
        });
    },

    /** Update an admin by id. Uses multipart when a profile picture is provided; otherwise JSON. */
    update: (id: number, adminData: Partial<AdminData>) => {
        if (adminData.profilePicture) {
            return apiFormDataRequest(`/admins/${id}`, buildAdminFormData(adminData), 'PUT');
        }
        return apiRequest(`/admins/${id}`, {
            method: 'PUT',
            data: buildAdminJson(adminData),
        });
    },

    /** Delete an admin by id. */
    delete: (id: number) => apiRequest(`/admins/${id}`, { method: 'DELETE' }),
};

// =========================
// Small utility builders
// =========================

/** Build multipart payload for admin create/update. */
function buildAdminFormData(adminData: Partial<AdminData>): FormData {
    const form = new FormData();
    if (adminData.firstname) form.append('firstname', adminData.firstname);
    if (adminData.lastname) form.append('lastname', adminData.lastname);
    if (adminData.email) form.append('email', adminData.email);
    if (adminData.password) form.append('password', adminData.password);
    if (adminData.role) form.append('role', adminData.role);
    if (adminData.cityIds) form.append('cityIds', JSON.stringify(adminData.cityIds));
    if (adminData.profilePicture) form.append('profilePicture', adminData.profilePicture);
    return form;
}

/** Build minimal JSON payload for admin create/update by stripping undefined. */
function buildAdminJson(adminData: Partial<AdminData>): Partial<AdminData> {
    return filterUndefined<Partial<AdminData>>({
        firstname: adminData.firstname,
        lastname: adminData.lastname,
        email: adminData.email,
        password: adminData.password,
        role: adminData.role,
        cityIds: adminData.cityIds,
    });
}

/** Returns undefined for empty strings, otherwise a trimmed string. */
function trimOrUndefined(value?: string): string | undefined {
    if (value == null) return undefined;
    const t = value.trim();
    return t.length ? t : undefined;
}

/** Removes keys whose values are undefined or null. */
function filterUndefined<T extends Record<string, unknown>>(obj: T): T {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v !== undefined && v !== null) out[k] = v;
    }
    return out as T;
}

