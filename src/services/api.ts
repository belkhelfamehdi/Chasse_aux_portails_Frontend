/**
 * API client utilities and typed endpoints for the frontend.
 * - Centralizes token handling (read/write, refresh, and propagation).
 * - Provides JSON and multipart helpers.
 * - Includes JSDoc to generate documentation.
 */

// Base configuration
/**
 * Base URL for the backend API.
 * Reads from VITE_API_URL and falls back to http://localhost:3000/api
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

/** Returns true when the response indicates an auth failure that might be recoverable. */
function isAuthError(res: Response) {
    return res.status === 401 || res.status === 403;
}

/** Try to parse an error body as JSON; fall back to text. */
async function parseErrorMessage(res: Response): Promise<string> {
    try {
        const data = await res.clone().json();
        if (data && typeof data === 'object') {
            const apiError = data as Partial<ApiError>;
            return apiError.error || `HTTP error ${res.status}`;
        }
    } catch {
        // ignore and fall back to text
    }
    try {
        const text = await res.text();
        return text || `HTTP error ${res.status}`;
    } catch {
        return `HTTP error ${res.status}`;
    }
}

/** Throw a descriptive Error for a non-OK response. */
async function throwFromResponse(res: Response): Promise<never> {
    throw new Error(await parseErrorMessage(res));
}

/** Performs a refresh token flow; returns true if a new token is stored. */
async function refreshAccessToken(): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { accessToken: string; user?: User };
    if (!data?.accessToken) return false;
    setStoredAuth(data.accessToken, data.user);
    return true;
}

/**
 * Execute a request with the current token and retry once after refresh on 401/403.
 * Keeps complexity low by centralizing the refresh logic.
 */
async function withAuthFetch(getRequest: (token: string | null) => Promise<Response>): Promise<Response> {
    const token = getStoredToken();
    let response = await getRequest(token);
    if (isAuthError(response) && token) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
            clearAuthAndRedirect();
            throw new Error('Session expired. Please login again.');
        }
        const newToken = getStoredToken();
        response = await getRequest(newToken);
    }
    return response;
}

// =========================
// Public HTTP helpers
// =========================

/**
 * Generic JSON API request helper.
 * - Attaches Authorization header if an access token is present.
 * - On 401/403, auto-attempts a refresh then retries once.
 *
 * @template T Expected JSON response type
 * @param endpoint API endpoint, e.g. "/cities"
 * @param options fetch options (method, body, headers, ...)
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const getRequest = (accessToken: string | null) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
        const config: RequestInit = {
            credentials: 'include',
            ...options,
            headers,
        };
        return fetch(url, config);
    };

    const response = await withAuthFetch(getRequest);
    if (!response.ok) await throwFromResponse(response);
    
    // Pour les réponses 204 (No Content), ne pas essayer de parser en JSON
    if (response.status === 204) {
        return {} as T;
    }
    
    // Vérifier s'il y a un contenu à parser
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
        return response.json() as Promise<T>;
    }
    
    // Si pas de contenu JSON, retourner un objet vide
    return {} as T;
}

/**
 * API request helper for multipart/form-data uploads.
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
    const url = `${API_BASE_URL}${endpoint}`;
    const getRequest = (accessToken: string | null) => {
        const headers: Record<string, string> = {};
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
        const config: RequestInit = {
            method,
            credentials: 'include',
            headers,
            body: formData,
        };
        return fetch(url, config);
    };

    const response = await withAuthFetch(getRequest);
    if (!response.ok) await throwFromResponse(response);
    return response.json() as Promise<T>;
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
            body: JSON.stringify({ email, password }),
        }),

    /** Logout current session. */
    logout: (): Promise<{ message: string }> =>
        apiRequest<{ message: string }>('/auth/logout', { method: 'POST' }),

    /** Request a new access token using the refresh cookie. */
    refreshToken: (): Promise<{ accessToken: string; user?: User }> =>
        apiRequest<{ accessToken: string; user?: User }>('/auth/refresh', { method: 'POST' }),
};

/** Cities endpoints */
export const citiesAPI = {
    /** Get all cities. */
    getAll: () => apiRequest('/cities'),

    /** Get a city by id. */
    getById: (id: number) => apiRequest(`/cities/${id}`),

    /** Create a city. */
    create: (cityData: CityData) =>
        apiRequest('/cities/create', { method: 'POST', body: JSON.stringify(cityData) }),

    /** Update a city by id. */
    update: (id: number, cityData: Partial<CityData>) =>
        apiRequest(`/cities/${id}`, { method: 'PUT', body: JSON.stringify(cityData) }),

    /** Delete a city by id. */
    delete: (id: number) => apiRequest(`/cities/${id}`, { method: 'DELETE' }),
};

/** Points Of Interest endpoints */
export const poisAPI = {
    /** Get all POIs. */
    getAll: () => apiRequest('/pois'),

    /** Get POIs by city id. */
    getByCity: (cityId: number) => apiRequest(`/pois/city/${cityId}`),

    /** Create a POI (JSON only; backend currently does not accept multipart for POIs). */
    create: (poiData: POIData) => {
        const payload = filterUndefined({
            nom: poiData.nom,
            description: poiData.description,
            latitude: poiData.latitude,
            longitude: poiData.longitude,
            cityId: poiData.cityId,
            iconUrl: trimOrUndefined(poiData.iconUrl),
            modelUrl: trimOrUndefined(poiData.modelUrl),
        });
        return apiRequest('/pois/create', { method: 'POST', body: JSON.stringify(payload) });
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
        return apiRequest(`/pois/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    },

    /** Delete a POI by id. */
    delete: (id: number) => apiRequest(`/pois/${id}`, { method: 'DELETE' }),
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
            body: JSON.stringify(buildAdminJson(adminData)),
        });
    },

    /** Update an admin by id. Uses multipart when a profile picture is provided; otherwise JSON. */
    update: (id: number, adminData: Partial<AdminData>) => {
        if (adminData.profilePicture) {
            return apiFormDataRequest(`/admins/${id}`, buildAdminFormData(adminData), 'PUT');
        }
        return apiRequest(`/admins/${id}`, {
            method: 'PUT',
            body: JSON.stringify(buildAdminJson(adminData)),
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

