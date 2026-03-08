import { apiSlice } from "./apiSlice";

export interface ContactInfo {
    _id?: string;
    address_en: string;
    address_mm: string;
    phone: string;
    email: string;
    facebook: string;
    twitter: string;
    instagram: string;
    working_hours_en: string;
    working_hours_mm: string;
    map_embed_url: string;
    createdAt?: string;
    updatedAt?: string;
}

export const contactInfoApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getContactInfo: builder.query<ContactInfo, void>({
            query: () => '/contact-info',
            transformResponse: (response: { success: boolean, contactInfo: ContactInfo }) => response.contactInfo,
            providesTags: ['ContactInfo'],
        }),
        updateContactInfo: builder.mutation<ContactInfo, Partial<ContactInfo>>({
            query: (data) => ({
                url: '/contact-info/update',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['ContactInfo'],
        }),
    }),
});

export const {
    useGetContactInfoQuery,
    useUpdateContactInfoMutation,
} = contactInfoApiSlice;
