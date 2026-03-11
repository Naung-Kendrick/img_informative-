import { apiSlice } from "./apiSlice";

export interface Faq {
    _id: string;
    question: string;
    answer: string;
    isActive: boolean;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export const faqApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllFaqs: builder.query<{ success: boolean; faqs: Faq[] }, void>({
            query: () => "/faqs",
            providesTags: ["Faq"],
        }),
        getFaqById: builder.query<{ success: boolean; faq: Faq }, string>({
            query: (id) => `/faqs/${id}`,
            providesTags: ["Faq"],
        }),
        createFaq: builder.mutation<{ success: boolean; faq: Faq }, Partial<Faq>>({
            query: (data) => ({
                url: "/faqs",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Faq"],
        }),
        updateFaq: builder.mutation<{ success: boolean; faq: Faq }, { id: string; data: Partial<Faq> }>({
            query: ({ id, data }) => ({
                url: `/faqs/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Faq"],
        }),
        deleteFaq: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/faqs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Faq"],
        }),
    }),
});

export const {
    useGetAllFaqsQuery,
    useGetFaqByIdQuery,
    useCreateFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
} = faqApiSlice;
