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

export interface GoogleLoginRequest {
    token: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password?: string;
    phone?: string;
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
        register: builder.mutation<LoginResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/users/register',
                method: 'POST',
                body: userData,
            }),
        }),
        googleLogin: builder.mutation<LoginResponse, GoogleLoginRequest>({
            query: (credentials) => ({
                url: '/users/google-login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGoogleLoginMutation } = authApiSlice;
