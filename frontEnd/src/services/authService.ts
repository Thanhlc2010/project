import { api } from '../lib/api';

interface LoginParams {
	email: string;
	password: string;
}

interface RegisterParams extends LoginParams {
	name: string;
}

interface AuthResponse {
	status: string;
	data: {
		id: string;
		email: string;
		name: string;
	};
}

export const authService = {
	async login(params: LoginParams): Promise<AuthResponse> {
		return api.post<AuthResponse>('/api/users/login', params);
	},

	async register(params: RegisterParams): Promise<AuthResponse> {
		return api.post<AuthResponse>('/api/users/register', params);
	},

	async getMe(): Promise<AuthResponse> {
		return api.get<AuthResponse>('/api/users/me');
	},

	async logout(): Promise<AuthResponse> {
		return api.post('/api/users/logout');
	},
};
