import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './index';

// Create a base API to initialize our RTK Query configuration
export const apiSlice = createApi({
    reducerPath: 'api',
    // Set the base URL matching our Node backend
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // This allows us to invalidate specific parts of our cache
    tagTypes: ['User', 'Category', 'News', 'Comment', 'Page', 'Contact'],
    // Endpoints will be injected in individual api slice extensions
    endpoints: () => ({}),
});
