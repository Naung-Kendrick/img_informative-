import { apiSlice } from "./apiSlice";

export interface Statistic {
    _id: string;
    title_en: string;
    title_mm: string;
    value: number;
    icon: string;
    date_en?: string;
    date_mm?: string;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export const statisticApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllStatistics: builder.query<Statistic[], void>({
            query: () => '/statistics',
            transformResponse: (response: { success: boolean, statistics: Statistic[] }) => response.statistics,
            providesTags: ['Statistic'],
        }),
        getStatisticById: builder.query<Statistic, string>({
            query: (id) => `/statistics/${id}`,
            transformResponse: (response: { success: boolean, statistic: Statistic }) => response.statistic,
            providesTags: (_result, _error, id) => [{ type: 'Statistic', id }],
        }),
        createStatistic: builder.mutation<Statistic, Partial<Statistic>>({
            query: (data) => ({
                url: '/statistics/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Statistic'],
        }),
        updateStatistic: builder.mutation<Statistic, { id: string, data: Partial<Statistic> }>({
            query: ({ id, data }) => ({
                url: `/statistics/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Statistic', id }, 'Statistic'],
        }),
        deleteStatistic: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/statistics/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Statistic'],
        }),
    }),
});

export const {
    useGetAllStatisticsQuery,
    useGetStatisticByIdQuery,
    useCreateStatisticMutation,
    useUpdateStatisticMutation,
    useDeleteStatisticMutation,
} = statisticApiSlice;
