import { apiSlice } from './apiSlice';

// ── Types ─────────────────────────────────────────────────────────────────
export interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface ContactsResponse {
    success: boolean;
    contacts: ContactMessage[];
}

export interface CreateContactPayload {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

// ── API Slice ─────────────────────────────────────────────────────────────
export const contactApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllContacts: builder.query<ContactMessage[], void>({
            query: () => '/contacts',
            transformResponse: (res: ContactsResponse) => res.contacts || [],
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Contact' as const, id: _id })),
                        { type: 'Contact' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Contact' as const, id: 'LIST' }],
        }),

        // Public — used on the client Contact page
        submitContact: builder.mutation<ContactMessage, CreateContactPayload>({
            query: (data) => ({
                url: '/contacts',
                method: 'POST',
                body: data,
            }),
        }),

        markContactAsRead: builder.mutation<ContactMessage, string>({
            query: (id) => ({
                url: `/contacts/${id}/read`,
                method: 'PATCH',
            }),
            invalidatesTags: (_, __, id) => [{ type: 'Contact', id }],
        }),

        deleteContact: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/contacts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Contact', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetAllContactsQuery,
    useSubmitContactMutation,
    useMarkContactAsReadMutation,
    useDeleteContactMutation,
} = contactApiSlice;
