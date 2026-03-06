import { apiSlice } from './apiSlice';
import type { User } from './authSlice';

export interface UsersResponse {
    success: boolean;
    users: User[];
}

export interface UpdateRoleRequest {
    userId: string;
    role: number;
}

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => '/users',
            transformResponse: (response: UsersResponse) => response.users,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'User' as const, id: _id })),
                        { type: 'User', id: 'LIST' },
                    ]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        updateUserRole: builder.mutation<User, UpdateRoleRequest>({
            query: (data) => ({
                url: '/users/update-role',
                method: 'PATCH',
                body: data,
            }),
            // Invalidate the cache to trigger a refetch of the users list
            invalidatesTags: (_, __, arg) => [{ type: 'User', id: arg.userId }],
        }),

        deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),

        // ── Profile Mutations ────────────────────────────────────────
        updateProfile: builder.mutation<{ success: boolean; user: User }, { name?: string; email?: string; phone?: string }>({
            query: (data) => ({
                url: '/users',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),

        updatePassword: builder.mutation<{ success: boolean; user: User }, { oldPassword: string; newPassword: string }>({
            query: (data) => ({
                url: '/users/update-pwd',
                method: 'PATCH',
                body: data,
            }),
        }),

        uploadAvatar: builder.mutation<{ success: boolean; user: User }, FormData>({
            query: (formData) => ({
                url: '/users/update-avatar',
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
    useUpdateProfileMutation,
    useUpdatePasswordMutation,
    useUploadAvatarMutation,
} = usersApiSlice;
