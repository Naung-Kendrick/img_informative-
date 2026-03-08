import { apiSlice } from './apiSlice';

export interface News {
    _id: string;
    title: string;
    content: string;
    category: string;
    images: string[];
    createdAt: string;
    author: { _id: string; name: string };
    status: "Draft" | "Published" | "Pending";
    likes: Array<{ _id: string; name: string; avatar?: string; email: string }>;
    views: number;
}

export interface NewsResponse {
    success: boolean;
    news: News[];
}

export interface SingleNewsResponse {
    success: boolean;
    news: News;
}

export interface CreateNewsPayload {
    title: string;
    content: string;
    category: string;
    images?: string[];
    status: 'Draft' | 'Published' | 'Pending';
}

export interface UploadImageResponse {
    success: boolean;
    urls: string[];
}

export const newsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllNews: builder.query<News[], void>({
            query: () => '/news',
            transformResponse: (res: NewsResponse) => res.news || [],
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'News' as const, id: _id })),
                        { type: 'News', id: 'LIST' },
                    ]
                    : [{ type: 'News', id: 'LIST' }],
        }),

        getNewsById: builder.query<News, string>({
            query: (id) => `/news/${id}`,
            transformResponse: (res: SingleNewsResponse) => res.news,
            providesTags: (_, __, id) => [{ type: 'News', id }],
        }),

        // ✅ Sends plain JSON — the image URL string from step-1 S3 upload is included as bannerImage.
        // express.json() middleware on the backend parses this correctly without multer.
        createNews: builder.mutation<News, CreateNewsPayload>({
            query: (data) => ({
                url: '/news',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'News', id: 'LIST' }],
        }),

        updateNews: builder.mutation<News, { id: string; data: Partial<News> }>({
            query: ({ id, data }) => ({
                url: `/news/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_, __, arg) => [{ type: 'News', id: arg.id }],
        }),

        deleteNews: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/news/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'News', id: 'LIST' }],
        }),

        toggleLikeNews: builder.mutation<News, string>({
            query: (id) => ({
                url: `/news/${id}/like`,
                method: 'PUT',
            }),
            invalidatesTags: (_, __, id) => [{ type: 'News', id }],
        }),

        // Uploads an image to S3, returns the public URL
        uploadImageToS3: builder.mutation<UploadImageResponse, FormData>({
            query: (formData) => ({
                url: '/news/upload',
                method: 'POST',
                body: formData,
                formData: true, // Prevents RTK Query from JSON-serializing the body
            }),
        }),
    }),
});

export const {
    useGetAllNewsQuery,
    useGetNewsByIdQuery,
    useCreateNewsMutation,
    useUpdateNewsMutation,
    useDeleteNewsMutation,
    useToggleLikeNewsMutation,
    useUploadImageToS3Mutation,
} = newsApiSlice;

