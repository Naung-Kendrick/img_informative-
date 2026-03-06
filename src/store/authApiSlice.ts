import { apiSlice } from './apiSlice';
import type { User } from './authSlice';

export interface LoginResponse {
    success: boolean;
    accessToken: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password?: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/users/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginMutation } = authApiSlice;
