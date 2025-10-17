const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// New API Response structure
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  statusCode: number;
}

// User interface matching the API response
export interface User {
  userId: string;
  fullname: string;
  privyId: string | null;
  walletAddress: string;
  email: string | null;
  image: string;
  joinDate: string;
}

// Get all users response structure
export interface GetUsersResponse {
  results: User[];
  total: number;
}

// Create user request structure
export interface CreateUserRequest {
  fullname: string;
  privyId: string;
  walletAddress: string;
  email?: string;
  image?: string;
}

// Update user request structure
export interface UpdateUserRequest {
  fullname?: string;
  walletAddress?: string;
  image?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add Authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = `${errorMessage} - ${errorData.message}`;
          }
        } catch {
          // If response is not JSON, use default error message
          errorMessage = `${errorMessage} - ${response.statusText}`;
        }
        
        // Handle specific status codes
        if (response.status === 500) {
          console.warn('Server error (500) - this might be a temporary issue');
        } else if (response.status === 409) {
          console.info('Conflict (409) - resource might already exist');
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', {
        url,
        method: config.method || 'GET',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  // Create a new user with retry logic
  async createUser(userData: CreateUserRequest, token?: string, retryCount = 0): Promise<User> {
    const maxRetries = 2;
    
    try {
      const response = await this.request<User>('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      }, token);
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Retry on 500 errors (server errors) but not on client errors (4xx)
      if (retryCount < maxRetries && errorMessage.includes('status: 500')) {
        console.log(`Retrying createUser request (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return this.createUser(userData, token, retryCount + 1);
      }
      
      // If it's a 409 (conflict), the user might already exist - this is not necessarily an error
      if (errorMessage.includes('status: 409')) {
        console.info('User might already exist (409 conflict)');
        throw new Error('User already exists');
      }
      
      throw error;
    }
  }

  // Get user by ID
  async getUser(id: string): Promise<User> {
    const response = await this.request<User>(`/users/${id}`);
    return response.data;
  }

  // Get all users
  async getAllUsers(): Promise<GetUsersResponse> {
    const response = await this.request<GetUsersResponse>('/users');
    return response.data;
  }
}

export const apiService = new ApiService();