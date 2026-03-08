import { apiSlice } from './apiSlice';

export const aboutApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAboutContent: builder.query({
            query: () => '/about',
            providesTags: ['About'],
        }),
        saveAboutContent: builder.mutation({
            query: (aboutData) => ({
                url: '/about',
                method: 'POST', // or PUT depending on implementation, POST works for our custom backend
                body: aboutData,
            }),
            invalidatesTags: ['About'],
        }),
    }),
});

export const {
    useGetAboutContentQuery,
    useSaveAboutContentMutation,
} = aboutApiSlice;
