import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Define the User interface matching your Backend Model
export interface User {
    _id: string;
    name: string;
    email: string;
    role: number;    // 0=Regular User, 1=Staff, 2=Admin, 3=Root_Admin
    active: boolean; // Active/Inactive Status
    lastLogin?: string;
    avatar?: string;
}

// Define the Auth State
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

// Check local storage for existing token/user on app load
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
    token: storedToken ? storedToken : null,
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Action called upon successful login
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;

            // Persist in LocalStorage
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        // Action called upon logout or token expiration
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            // Clear LocalStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        // Action to optionally update user data (e.g., if checking current user info)
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        }
    },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
