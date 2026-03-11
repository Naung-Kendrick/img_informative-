export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: number;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface INews {
    _id: string;
    title: string;
    content: string;
    category: string;
    images: string[];
    createdAt: string;
    updatedAt?: string;
    author: { _id: string; name: string };
    status: "Draft" | "Published" | "Pending";
    likes: Array<{ _id: string; name: string; avatar?: string; email: string }>;
    views: number;
    district?: string;
    township?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    status: number;
    data: {
        success: boolean;
        message: string;
        stack?: string;
    };
}

export interface CreateNewsPayload {
    title: string;
    content: string;
    category: string;
    images?: string[];
    status: 'Draft' | 'Published' | 'Pending';
    district?: string;
    township?: string;
}

export interface UploadImageResponse {
    success: boolean;
    urls: string[];
}
