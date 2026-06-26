const DEFAULT_API_BASE_URL = 'http://localhost:3000';

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL)
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/\/+$/g, '');
}

function apiUrl(path: string) {
  try {
    return new URL(path, `${getApiBaseUrl()}/`).toString();
  } catch {
    throw new Error('Invalid NEXT_PUBLIC_API_URL. Use a full URL like http://localhost:3000');
  }
}

async function readError(response: Response, fallback: string) {
  try {
    const error = await response.json();
    return error.error || error.message || fallback;
  } catch {
    return fallback;
  }
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  number: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  number: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface VerifyEmailRequest {
  code: string;
}

export interface AccountResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  number: number;
  balance: number;
  createdAt: string;
}

export interface RegisterResponse {
  message: string;
}

export const api = {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await fetch(apiUrl('/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: Number(credentials.number),
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        throw new Error(await readError(response, 'Login failed'));
      }

      return { data: await response.json() };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  },

  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await fetch(apiUrl('/account'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await readError(response, 'Registration failed'));
      }

      return { data: await response.json() };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  },

  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse<{ verified: boolean }>> {
    try {
      const response = await fetch(apiUrl('/account/verification'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await readError(response, 'Verification failed'));
      }

      return { data: await response.json() };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  },

  async getAccount(token: string): Promise<ApiResponse<AccountResponse>> {
    try {
      const response = await fetch(apiUrl('/account'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(await readError(response, 'Failed to fetch account'));
      }

      return { data: await response.json() };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(apiUrl('/health'));
      return response.ok;
    } catch {
      return false;
    }
  },
};
