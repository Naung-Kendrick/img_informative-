import { apiSlice } from './apiSlice';

export interface Announcement {
    _id: string;
    title: string;
    documentImages: string[];
    publishedDate: string;
    referenceNumber?: string;
    status: "Draft" | "Published" | "Pending";
    author: { _id: string; name: string };
    createdAt: string;
}

export interface AnnouncementsResponse {
    success: boolean;
    announcements: Announcement[];
}

export interface SingleAnnouncementResponse {
    success: boolean;
    announcement: Announcement;
}

export interface CreateAnnouncementPayload {
    title: string;
    documentImages: string[];
    publishedDate: string;
    referenceNumber?: string;
    status: "Draft" | "Published" | "Pending";
}

export interface UploadAnnouncementImageResponse {
    success: boolean;
    urls: string[];
}

export const announcementApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllAnnouncements: builder.query<Announcement[], void>({
            query: () => '/announcements',
            transformResponse: (res: AnnouncementsResponse) => res.announcements || [],
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Announcement' as const, id: _id })),
                        { type: 'Announcement', id: 'LIST' },
                    ]
                    : [{ type: 'Announcement', id: 'LIST' }],
        }),

        getAnnouncementById: builder.query<Announcement, string>({
            query: (id) => `/announcements/${id}`,
            transformResponse: (res: SingleAnnouncementResponse) => res.announcement,
            providesTags: (_, __, id) => [{ type: 'Announcement', id }],
        }),

        createAnnouncement: builder.mutation<Announcement, CreateAnnouncementPayload>({
            query: (data) => ({
                url: '/announcements',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Announcement', id: 'LIST' }],
        }),

        updateAnnouncement: builder.mutation<Announcement, { id: string; data: Partial<Announcement> }>({
            query: ({ id, data }) => ({
                url: `/announcements/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_, __, arg) => [{ type: 'Announcement', id: arg.id }],
        }),

        deleteAnnouncement: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/announcements/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Announcement', id: 'LIST' }],
        }),

        uploadAnnouncementImageToS3: builder.mutation<UploadAnnouncementImageResponse, FormData>({
            query: (formData) => ({
                url: '/announcements/upload',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllAnnouncementsQuery,
    useGetAnnouncementByIdQuery,
    useCreateAnnouncementMutation,
    useUpdateAnnouncementMutation,
    useDeleteAnnouncementMutation,
    useUploadAnnouncementImageToS3Mutation,
} = announcementApiSlice;
