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
        addUser: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/add`,
                method: "PUT",
                body: data,
            })
        }),
        // getTeamList: builder.query({
        //     query: () =>({
        //         url: `${USER_URL}/get-team`,
        //         method: "GET",
        //         credentials: "include",
        //     }),
        // }),
    }),
});

export const { useUpdateUserMutation , useAddUserMutation } =  userApi;