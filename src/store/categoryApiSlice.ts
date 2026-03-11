import { apiSlice } from "./apiSlice";

export interface Category {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    order: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query<{ success: boolean, categories: Category[] }, void>({
            query: () => "/categories",
            providesTags: ["Category"],
        }),
        createCategory: builder.mutation<{ success: boolean, category: Category }, Partial<Category>>({
            query: (data) => ({
                url: "/categories",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),
        updateCategory: builder.mutation<{ success: boolean, category: Category }, { id: string; data: Partial<Category> }>({
            query: ({ id, data }) => ({
                url: `/categories/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),
        deleteCategory: builder.mutation<{ success: boolean, message: string }, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),
        reorderCategories: builder.mutation<{ success: boolean, message: string }, { id: string, order: number }[]>({
            query: (categories) => ({
                url: "/categories/reorder",
                method: "PUT",
                body: { categories },
            }),
            // Optimistic update can be done here, but invalidating is safer
            invalidatesTags: ["Category"],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useReorderCategoriesMutation,
} = categoryApiSlice;
