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

// Vault interfaces - matching backend model exactly
export interface Vault {
  vault_id: string;
  vault_type: string;
  vault_name: string;
  vault_image: string;
  vault_address: string;
  token_program: string;
  token_address: string;
  vault_token_address: string;
  vault_token_mint: string;
  locked_start: string; // Date as ISO string from API
  locked_end: string; // Date as ISO string from API
  vault_strategy: string;
  vault_risks: string;
  description: string;
  manager_id: string;
  battle_id: number | null;
  battle_status: string;
  last_performance_update: string; // Date as ISO string from API
  risk_level: string;
  apy: number;
  deposit_asset: string;
  min_deposit: number;
  // Relations
  manager?: Manager;
  battle?: Battle;
}

export interface GetVaultsResponse {
  results: Vault[];
  total: number;
}

export interface VaultPerformanceData {
  date: string;
  value: number;
  roi: number;
  sharePrice: number;
  vaultBalance: number;
}

export interface VaultPerformanceResponse {
  period: string;
  data: VaultPerformanceData[];
  summary: {
    totalReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

// Note: Performance data should come from backend API, not generated client-side

// Battle interfaces - Updated to match backend model exactly
export interface Battle {
  battle_id: number;
  battle_name: string;
  battle_image: string | null;
  battle_description: string | null;
  battle_start: string; // Date as ISO string
  battle_end: string; // Date as ISO string
  program_address: string;
  treasury_address: string;
  owner_address: string;
  pda_address: string;
  arena_type: 'DCA Strategy' | 'Lending Strategy' | 'Mixed Strategy' | 'Yield Farming';
  current_phase: 'Registration' | 'Stake Phase' | 'Battle Phase' | 'Resolution Phase' | 'Completed';
  prize_pool: number; // bigint from backend converted to number
  winner_vault_id: string | null;
  arena_color: string | null;
  battle_status: 'active';
  vaults?: Vault[];
}

export interface GetBattlesResponse {
  results: Battle[];
  total: number;
}

// Manager interfaces
export interface Manager {
  manager_id: string;
  manager_name: string;
  wallet_address: string;
  manager_token_address: string;
  image: string;
  is_kyb: boolean;
}

export interface GetManagersResponse {
  results: Manager[];
  total: number;
}

// Token interfaces
export interface Token {
  tokenId: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenImage: string;
  tokenDecimals: number;
  network: string;
  created_at: string;
}

export interface GetTokensResponse {
  results: Token[];
  total: number;
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

  // Vault API methods
  async getVault(id: string): Promise<Vault> {
    const response = await this.request<Vault>(`/vault/${id}`);
    return response.data;
  }

  async getAllVaults(skip: number = 0, limit: number = 10): Promise<GetVaultsResponse> {
    const response = await this.request<GetVaultsResponse>(`/vault?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  async getVaultsByBattleId(battleId: number): Promise<Vault[]> {
    const response = await this.request<Vault[]>(`/vault/battle/${battleId}`);
    return response.data;
  }

  async getVaultPerformance(vaultId: string, period: string = '14D'): Promise<VaultPerformanceResponse> {
    const response = await this.request<VaultPerformanceResponse>(`/vault/${vaultId}/performance?period=${period}`);
    return response.data;
  }

  async disqualifyVault(vaultId: string): Promise<Vault> {
    const response = await this.request<Vault>(`/vault/${vaultId}/disqualify`, {
      method: 'POST',
    });
    return response.data;
  }

  // Battle API methods
  async getBattle(id: string): Promise<Battle> {
    const response = await this.request<Battle>(`/battle/${id}`);
    return response.data;
  }

  async getAllBattles(skip: number = 0, limit: number = 10): Promise<GetBattlesResponse> {
    const response = await this.request<GetBattlesResponse>(`/battle?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  // Manager API methods
  async getManager(id: string): Promise<Manager> {
    const response = await this.request<Manager>(`/manager/${id}`);
    return response.data;
  }

  async getAllManagers(skip: number = 0, limit: number = 10): Promise<GetManagersResponse> {
    const response = await this.request<GetManagersResponse>(`/manager?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  // Token API methods
  async getToken(id: string): Promise<Token> {
    const response = await this.request<Token>(`/token/${id}`);
    return response.data;
  }

  async getTokenByAddress(address: string): Promise<Token> {
    const response = await this.request<Token>(`/token/address/${address}`);
    return response.data;
  }

  async getTokensByNetwork(network: string, skip: number = 0, limit: number = 10): Promise<Token[]> {
    const response = await this.request<Token[]>(`/token/network/${network}?skip=${skip}&limit=${limit}`);
    return response.data;
  }
}

export const apiService = new ApiService();