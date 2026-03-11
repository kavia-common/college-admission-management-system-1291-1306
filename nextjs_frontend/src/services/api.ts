/**
 * API Service Layer
 * Centralized HTTP client for communicating with the FastAPI backend.
 * All API calls go through this service.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Generic response type for API calls
 */
interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Gets the auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Sets the auth token in localStorage
 */
// PUBLIC_INTERFACE
export function setAuthToken(token: string): void {
  /** Stores the authentication token in browser localStorage */
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

/**
 * Removes the auth token from localStorage
 */
// PUBLIC_INTERFACE
export function clearAuthToken(): void {
  /** Clears the authentication token from browser localStorage */
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

/**
 * Core fetch wrapper with error handling and auth headers
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove Content-Type for FormData (browser sets boundary automatically)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data: T | null = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMessage = (data as Record<string, string>)?.detail || 
                           (data as Record<string, string>)?.message || 
                           `Request failed with status ${response.status}`;
      return { data: null, error: errorMessage, status: response.status };
    }

    return { data, error: null, status: response.status };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { data: null, error: message, status: 0 };
  }
}

// ==================== AUTH API ====================

// PUBLIC_INTERFACE
export const authApi = {
  /** Login with email and password, returns JWT token and user info */
  async login(email: string, password: string) {
    return apiFetch<{ access_token: string; user: Record<string, unknown> }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /** Register a new applicant account */
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    return apiFetch<{ access_token: string; user: Record<string, unknown> }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** Get current user profile */
  async getProfile() {
    return apiFetch<Record<string, unknown>>('/api/auth/profile');
  },

  /** Check health of the backend */
  async healthCheck() {
    return apiFetch<{ status: string }>('/');
  },
};

// ==================== PROGRAMS API ====================

// PUBLIC_INTERFACE
export const programsApi = {
  /** List all available programs */
  async list(params?: { search?: string; department?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.department) query.set('department', params.department);
    const qs = query.toString();
    return apiFetch<Record<string, unknown>[]>(`/api/programs${qs ? `?${qs}` : ''}`);
  },

  /** Get a single program by ID */
  async get(id: string) {
    return apiFetch<Record<string, unknown>>(`/api/programs/${id}`);
  },

  /** Create a new program (admin) */
  async create(data: Record<string, unknown>) {
    return apiFetch<Record<string, unknown>>('/api/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** Update a program (admin) */
  async update(id: string, data: Record<string, unknown>) {
    return apiFetch<Record<string, unknown>>(`/api/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** Delete a program (admin) */
  async delete(id: string) {
    return apiFetch(`/api/programs/${id}`, { method: 'DELETE' });
  },
};

// ==================== APPLICATIONS API ====================

// PUBLIC_INTERFACE
export const applicationsApi = {
  /** List applications for current user */
  async list() {
    return apiFetch<Record<string, unknown>[]>('/api/applications');
  },

  /** Get a single application by ID */
  async get(id: string) {
    return apiFetch<Record<string, unknown>>(`/api/applications/${id}`);
  },

  /** Create a new application */
  async create(data: Record<string, unknown>) {
    return apiFetch<Record<string, unknown>>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** Update an existing application (draft) */
  async update(id: string, data: Record<string, unknown>) {
    return apiFetch<Record<string, unknown>>(`/api/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** Submit a draft application */
  async submit(id: string) {
    return apiFetch<Record<string, unknown>>(`/api/applications/${id}/submit`, {
      method: 'POST',
    });
  },

  /** Get all applications (admin) */
  async listAll(params?: { status?: string; program_id?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.program_id) query.set('program_id', params.program_id);
    const qs = query.toString();
    return apiFetch<Record<string, unknown>[]>(`/api/admin/applications${qs ? `?${qs}` : ''}`);
  },

  /** Review an application (admin) */
  async review(id: string, data: { status: string; remarks?: string }) {
    return apiFetch<Record<string, unknown>>(`/api/admin/applications/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== DOCUMENTS API ====================

// PUBLIC_INTERFACE
export const documentsApi = {
  /** Upload a document for an application */
  async upload(applicationId: string, file: File, documentType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    formData.append('application_id', applicationId);
    return apiFetch<Record<string, unknown>>('/api/documents/upload', {
      method: 'POST',
      body: formData,
    });
  },

  /** List documents for an application */
  async list(applicationId: string) {
    return apiFetch<Record<string, unknown>[]>(`/api/documents?application_id=${applicationId}`);
  },

  /** Delete a document */
  async delete(id: string) {
    return apiFetch(`/api/documents/${id}`, { method: 'DELETE' });
  },
};

// ==================== PAYMENTS API ====================

// PUBLIC_INTERFACE
export const paymentsApi = {
  /** Initiate a fee payment for an application */
  async initiate(applicationId: string, amount: number) {
    return apiFetch<Record<string, unknown>>('/api/payments', {
      method: 'POST',
      body: JSON.stringify({ application_id: applicationId, amount }),
    });
  },

  /** Confirm/mock-complete a payment */
  async confirm(paymentId: string) {
    return apiFetch<Record<string, unknown>>(`/api/payments/${paymentId}/confirm`, {
      method: 'POST',
    });
  },

  /** Get payment status */
  async getStatus(applicationId: string) {
    return apiFetch<Record<string, unknown>>(`/api/payments?application_id=${applicationId}`);
  },
};

// ==================== NOTIFICATIONS API ====================

// PUBLIC_INTERFACE
export const notificationsApi = {
  /** List notifications for current user */
  async list() {
    return apiFetch<Record<string, unknown>[]>('/api/notifications');
  },

  /** Mark a notification as read */
  async markRead(id: string) {
    return apiFetch(`/api/notifications/${id}/read`, { method: 'POST' });
  },

  /** Mark all notifications as read */
  async markAllRead() {
    return apiFetch('/api/notifications/read-all', { method: 'POST' });
  },
};

// ==================== ADMIN API ====================

// PUBLIC_INTERFACE
export const adminApi = {
  /** Get dashboard statistics */
  async getDashboardStats() {
    return apiFetch<Record<string, unknown>>('/api/admin/dashboard');
  },

  /** Schedule an interview */
  async scheduleInterview(data: Record<string, unknown>) {
    return apiFetch<Record<string, unknown>>('/api/admin/interviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** List interviews */
  async listInterviews(params?: { program_id?: string; date?: string }) {
    const query = new URLSearchParams();
    if (params?.program_id) query.set('program_id', params.program_id);
    if (params?.date) query.set('date', params.date);
    const qs = query.toString();
    return apiFetch<Record<string, unknown>[]>(`/api/admin/interviews${qs ? `?${qs}` : ''}`);
  },

  /** Generate merit list */
  async generateMeritList(programId: string) {
    return apiFetch<Record<string, unknown>[]>(`/api/admin/merit-list/${programId}`, {
      method: 'POST',
    });
  },

  /** Get merit list */
  async getMeritList(programId: string) {
    return apiFetch<Record<string, unknown>[]>(`/api/admin/merit-list/${programId}`);
  },

  /** Allocate seats */
  async allocateSeats(programId: string, data: Record<string, unknown>) {
    return apiFetch<Record<string, unknown>>(`/api/admin/seat-allocation/${programId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** Get seat allocation */
  async getSeatAllocation(programId: string) {
    return apiFetch<Record<string, unknown>>(`/api/admin/seat-allocation/${programId}`);
  },

  /** Get reports */
  async getReports(type: string) {
    return apiFetch<Record<string, unknown>>(`/api/admin/reports?type=${type}`);
  },
};

// ==================== FAQ API ====================

// PUBLIC_INTERFACE
export const faqApi = {
  /** List FAQs */
  async list() {
    return apiFetch<Record<string, unknown>[]>('/api/faqs');
  },
};

// ==================== CONTACT API ====================

// PUBLIC_INTERFACE
export const contactApi = {
  /** Submit a contact form */
  async submit(data: { name: string; email: string; subject: string; message: string }) {
    return apiFetch<Record<string, unknown>>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
