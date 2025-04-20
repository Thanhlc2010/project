import { api } from './api';

// Định nghĩa interface cho một workspace item
interface Workspace {
    id: string;
    name: string;
    ownerId: string;
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'; // Sử dụng union type để định nghĩa các giá trị có thể có
    createdAt: string; // ISO string date format
    updatedAt: string; // ISO string date format
  }
  
  // Định nghĩa interface cho response của API workspace
  interface WorkspaceResponse {
    data: Workspace[];
    // Có thể thêm các field khác nếu API của bạn cũng trả về như status, message,...
    status?: string;
    message?: string;
  }

export const authService = {
    async getAll(): Promise<WorkspaceResponse> {
        return api.get<WorkspaceResponse>('/api/workspaces');
    },
};
