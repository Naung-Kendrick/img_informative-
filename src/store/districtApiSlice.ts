import { apiSlice } from './apiSlice';

export interface District {
    _id: string;
    name: string;
    coverImage: string;
    address: string;
    phone: string;
    mapUrl?: string;
    createdAt: string;
}

export interface DistrictsResponse {
    success: boolean;
    districts: District[];
}

export interface SingleDistrictResponse {
    success: boolean;
    district: District;
}

export interface CreateDistrictPayload {
    name: string;
    coverImage: string;
    address: string;
    phone: string;
    mapUrl?: string;
}

export const districtApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllDistricts: builder.query<District[], void>({
            query: () => '/districts',
            transformResponse: (res: DistrictsResponse) => res.districts || [],
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'District' as const, id: _id })),
                        { type: 'District', id: 'LIST' },
                    ]
                    : [{ type: 'District', id: 'LIST' }],
        }),

        getDistrictById: builder.query<District, string>({
            query: (id) => `/districts/${id}`,
            transformResponse: (res: SingleDistrictResponse) => res.district,
            providesTags: (_, __, id) => [{ type: 'District', id }],
        }),

        createDistrict: builder.mutation<District, FormData>({
            query: (formData) => ({
                url: '/districts',
                method: 'POST',
                body: formData,
                formData: true,
            }),
            invalidatesTags: [{ type: 'District', id: 'LIST' }],
        }),

        updateDistrict: builder.mutation<District, { id: string; data: Partial<District> }>({
            query: ({ id, data }) => ({
                url: `/districts/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_, __, arg) => [{ type: 'District', id: arg.id }],
        }),

        deleteDistrict: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/districts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'District', id: 'LIST' }],
        }),

        uploadDistrictImage: builder.mutation<{ success: boolean; url: string }, FormData>({
            query: (formData) => ({
                url: '/districts/upload',
                // There is no /districts/upload route created. Actually it's not created.
                // Wait, in district.route.ts we don't have separate upload route? 
                // Ah! We can use standard user-file-upload or just pass formData to /districts directly if using multer on the POST.
                // But since we built a freeform cropper earlier, I should check how we uploaded images in CreateCategory or CreateNews.
                // Or I can send FormData directly to createDistrict (POST /districts with multipart/form-data).
                method: 'POST',
                body: formData,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllDistrictsQuery,
    useGetDistrictByIdQuery,
    useCreateDistrictMutation,
    useUpdateDistrictMutation,
    useDeleteDistrictMutation,
    useUploadDistrictImageMutation, // if needed
} = districtApiSlice;
