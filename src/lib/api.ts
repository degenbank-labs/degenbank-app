const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/v1';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  bio?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  isVerified: boolean;
  privyUserId?: string;
  solanaWalletAddress?: string;
  ethWalletAddress?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  name: string;
  bio?: string;
  privyUserId?: string;
  solanaWalletAddress?: string;
  ethWalletAddress?: string;
}

export interface UpdateUserRequest {
  username?: string;
  name?: string;
  bio?: string;
  solanaWalletAddress?: string;
  ethWalletAddress?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginRequest {
  accessToken: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  isNewUser: boolean;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Health check
  async health(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // API info
  async info(): Promise<ApiResponse> {
    return this.request('/');
  }

  // Authentication endpoints
  async login(loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  async verify(accessToken: string): Promise<ApiResponse<{ user: User; isNewUser: boolean }>> {
    return this.request<{ user: User; isNewUser: boolean }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints (protected)
  async getUsers(params?: UserQueryParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
    if (params?.isVerified !== undefined) searchParams.append('isVerified', params.isVerified.toString());

    const queryString = searchParams.toString();
    return this.request<PaginatedResponse<User>>(`/protected/users${queryString ? `?${queryString}` : ''}`);
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/protected/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/protected/users/${id}`);
  }

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/protected/users/email/${email}`);
  }

  async getUserByUsername(username: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/protected/users/username/${username}`);
  }

  async getUserByWalletAddress(address: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/protected/users/wallet/${address}`);
  }

  async getUserBySolanaWallet(address: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/protected/users/solana-wallet/${address}`);
  }

  async getUserByEthWallet(address: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/protected/users/eth-wallet/${address}`);
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>(`/protected/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return this.request(`/protected/users/${id}`, {
      method: 'DELETE',
    });
  }

}

export const apiService = new ApiService();