import { apiSlice } from "../apiS";

/* eslint-disable no-unused-vars */
const AUTH_URL = "/user";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: "POST",
                body: data,
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/register`,
                method: "POST",
                body: data,
            })
        }),
        forgot: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/forgot`,
                method: "POST",
                body: data,
            })
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useForgotMutation } = authApi;
