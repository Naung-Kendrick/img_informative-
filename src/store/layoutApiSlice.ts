import { apiSlice } from "./apiSlice";

export interface ILayoutSection {
    sectionId: string;
    title: string;
    isVisible: boolean;
    order: number;
}

export const layoutApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLayout: builder.query<ILayoutSection[], void>({
            query: () => "/layout",
            providesTags: ["Layout"],
            transformResponse: (response: { success: boolean, sections: ILayoutSection[] }) => {
                return response.sections.sort((a, b) => a.order - b.order);
            }
        }),
        updateLayout: builder.mutation<{ success: boolean, sections: ILayoutSection[], message: string }, ILayoutSection[]>({
            query: (sections) => ({
                url: "/layout",
                method: "PUT",
                body: { sections }
            }),
            invalidatesTags: ["Layout"],
        })
    })
});

export const { useGetLayoutQuery, useUpdateLayoutMutation } = layoutApiSlice;
