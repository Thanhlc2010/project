import { create } from 'zustand';

import { authService } from '../services/authService';

interface User {
	id: string;
	email: string;
	name: string;
}

interface AuthState {
	user: User | null;
	loading: boolean;
	error: string | null;
	isAuthenticated: boolean;
	setUser: (user: User | null) => void;
	login: (email: string, password: string, onSuccess?: () => void) => Promise<void>;
	register: (email: string, password: string, name: string) => Promise<void>;
	logout: () => Promise<void>;
}

const getInitialUserData = () => {
	if (typeof window === 'undefined') return null;
	const userDataCookie = document.cookie
		.split('; ')
		.find((row) => row.startsWith('userData='))
		?.split('=')[1];

	if (!userDataCookie) return null;

	try {
		const decodedValue = decodeURIComponent(userDataCookie);
		const userData = JSON.parse(decodedValue);
		return userData;
	} catch {
		return null;
	}
};

export const useAuthStore = create<AuthState>()((set) => ({
	user: getInitialUserData(),
	loading: false,
	error: null,
	isAuthenticated: !!getInitialUserData(),

	setUser: (user: User | null) => {
		set({
			user,
			isAuthenticated: !!user,
			loading: false,
			error: null,
		});
	},

	login: async (email: string, password: string, onSuccess?: () => void) => {
		try {
			set({ loading: true, error: null });
			const response = await authService.login({ email, password });
			set({
				user: response.data,
				loading: false,
				error: null,
				isAuthenticated: true,
			});

			setTimeout(() => {
				set({
					user: response.data || getInitialUserData(),
				});
			}, 1000);
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			set({
				loading: false,
				error: error instanceof Error ? error.message : 'Login failed',
				isAuthenticated: false,
			});
		}
	},

	register: async (email: string, password: string, name: string) => {
		try {
			set({ loading: true, error: null });
			const response = await authService.register({ email, password, name });
			set({
				user: response.data,
				loading: false,
				error: null,
				isAuthenticated: true,
			});

			setTimeout(() => {
				set({
					user: response.data || getInitialUserData(),
					loading: false,
					error: null,
					isAuthenticated: true,
				});
			}, 1000);
		} catch (error) {
			set({
				loading: false,
				error: error instanceof Error ? error.message : 'Registration failed',
				isAuthenticated: false,
			});
			throw error;
		}
	},

	logout: async () => {
		try {
			set({ loading: true, error: null });
			await authService.logout();
			set({
				user: null,
				loading: false,
				error: null,
				isAuthenticated: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: error instanceof Error ? error.message : 'Logout failed',
			});
		}
	},
}));
