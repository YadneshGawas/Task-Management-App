/* eslint-disable no-unused-vars */
import { apiSlice } from "../apiS";

const USER_URL = "/user";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/update`,
                method: "PUT",
                body: data,
            })
        }),
        chpassUser: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/changepassword`,
                method: "PUT",
                body: data,
            })
        }),
        addUser: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/add`,
                method: "POST",
                body: data,
            })
        }),
        deleteUser: builder.mutation({
            query: (id) =>({
                url: `${USER_URL}/delete`,
                method: "POST",
                body: { id },
            })
        }),
        getUsers: builder.query({
            query: (id) =>({
                url: `${USER_URL}/getusers/${id}`,
                method: "GET",
            })
        }),
        getTeamList: builder.query({
            query: () =>({
                url: `${USER_URL}/get-team`,
                method: "GET",
                credentials: "include",
            }),
        }),
    }),
});

export const { useUpdateUserMutation , useAddUserMutation, useChpassUserMutation, useDeleteUserMutation, useUserActionMutation, useGetUsersQuery ,useGetTeamListQuery} =  userApi;