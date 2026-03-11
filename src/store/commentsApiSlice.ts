import { apiSlice } from './apiSlice';

export interface Comment {
    _id: string;
    content: string;
    newsId: string;
    author: { _id: string; name: string; avatar?: string; role: number };
    createdAt: string;
}

export interface CommentsResponse {
    success: boolean;
    comments: Comment[];
}

export const commentsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCommentsByNewsId: builder.query<Comment[], string>({
            query: (newsId) => `/comments/${newsId}`,
            transformResponse: (res: CommentsResponse) => res.comments || [],
            // Tags matching the specific news ID dynamically refreshes strictly the related article!
            providesTags: (_, __, newsId) => [{ type: 'Comment', id: newsId }],
        }),

        addComment: builder.mutation<Comment, { newsId: string; content: string }>({
            query: ({ newsId, content }) => ({
                url: `/comments/${newsId}`,
                method: 'POST',
                body: { content },
            }),
            // Invalidate specifically the comments bound to the current News item
            invalidatesTags: (_, __, arg) => [{ type: 'Comment', id: arg.newsId }],
        }),

        deleteComment: builder.mutation<{ success: boolean; message: string }, { commentId: string, newsId: string }>({
            query: ({ commentId }) => ({
                url: `/comments/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_, __, arg) => [{ type: 'Comment', id: arg.newsId }],
        }),

        updateComment: builder.mutation<Comment, { commentId: string; content: string; newsId: string }>({
            query: ({ commentId, content }) => ({
                url: `/comments/${commentId}`,
                method: 'PATCH',
                body: { content },
            }),
            invalidatesTags: (_, __, arg) => [{ type: 'Comment', id: arg.newsId }],
        }),
    }),
});

export const {
    useGetCommentsByNewsIdQuery,
    useAddCommentMutation,
    useDeleteCommentMutation,
    useUpdateCommentMutation,
} = commentsApiSlice;
