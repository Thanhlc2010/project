/* eslint-disable @typescript-eslint/no-explicit-any */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
	async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
		}

		return response.json();
	},

	get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		return this.request<T>(endpoint, { ...options, method: 'GET' });
	},

	post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined,
		});
	},

	put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined,
		});
	},

	delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		return this.request<T>(endpoint, { ...options, method: 'DELETE' });
	},
};
