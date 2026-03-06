import { apiSlice } from './apiSlice';

// ── Types ─────────────────────────────────────────────────────────────────
export interface Page {
    _id: string;
    title: string;
    content: string;
    bannerImage: string;
    section: 'services' | 'districts';
    status: 'Draft' | 'Published';
    author: { _id: string; name: string };
    order: number;
    createdAt: string;
}

export interface PagesResponse {
    success: boolean;
    pages: Page[];
}

export interface SinglePageResponse {
    success: boolean;
    page: Page;
}

export interface CreatePagePayload {
    title: string;
    content: string;
    section: 'services' | 'districts';
    status: 'Draft' | 'Published';
    bannerImage?: string;
    order?: number;
}

// ── API Slice ─────────────────────────────────────────────────────────────
export const pageApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPagesBySection: builder.query<Page[], string>({
            query: (section) => `/pages/section/${section}`,
            transformResponse: (res: PagesResponse) => res.pages || [],
            providesTags: (result, _, section) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Page' as const, id: _id })),
                        { type: 'Page' as const, id: section },
                    ]
                    : [{ type: 'Page' as const, id: section }],
        }),

        getPageById: builder.query<Page, string>({
            query: (id) => `/pages/${id}`,
            transformResponse: (res: SinglePageResponse) => res.page,
            providesTags: (_, __, id) => [{ type: 'Page' as const, id }],
        }),

        createPage: builder.mutation<Page, CreatePagePayload>({
            query: (data) => ({
                url: '/pages',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_, __, arg) => [{ type: 'Page', id: arg.section }],
        }),

        updatePage: builder.mutation<Page, { id: string; data: Partial<CreatePagePayload> }>({
            query: ({ id, data }) => ({
                url: `/pages/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_, __, arg) => [{ type: 'Page', id: arg.id }],
        }),

        deletePage: builder.mutation<{ success: boolean; message: string }, { id: string; section: string }>({
            query: ({ id }) => ({
                url: `/pages/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_, __, arg) => [{ type: 'Page', id: arg.section }],
        }),
    }),
});

export const {
    useGetPagesBySectionQuery,
    useGetPageByIdQuery,
    useCreatePageMutation,
    useUpdatePageMutation,
    useDeletePageMutation,
} = pageApiSlice;
