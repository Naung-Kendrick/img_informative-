import { apiSlice } from './apiSlice';

export interface Report {
    _id: string;
    news: { _id: string; title: string; category: string };
    reporter?: { _id: string; name: string; email: string; avatar?: string };
    reason: string;
    details?: string;
    status: 'Pending' | 'Resolved' | 'Dismissed';
    isRead: boolean;
    createdAt: string;
}

export const reportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllReports: builder.query<Report[], void>({
            query: () => '/reports',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Report' as const, id: _id })),
                        { type: 'Report', id: 'LIST' },
                    ]
                    : [{ type: 'Report', id: 'LIST' }],
        }),

        createReport: builder.mutation<Report, { newsId: string; reason: string; details?: string }>({
            query: (data) => ({
                url: '/reports',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Report', id: 'LIST' }],
        }),

        markReportAsRead: builder.mutation<Report, string>({
            query: (id) => ({
                url: `/reports/${id}/read`,
                method: 'PATCH',
            }),
            invalidatesTags: (_, __, id) => [{ type: 'Report', id }],
        }),

        updateReportStatus: builder.mutation<Report, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/reports/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: (_, __, arg) => [{ type: 'Report', id: arg.id }],
        }),

        deleteReport: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/reports/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Report', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetAllReportsQuery,
    useCreateReportMutation,
    useMarkReportAsReadMutation,
    useUpdateReportStatusMutation,
    useDeleteReportMutation,
} = reportApiSlice;
