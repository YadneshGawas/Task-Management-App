import { apiSlice } from "../apiS";

const CHAT_URL = "/chat";

export const chatApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchMessages: builder.query({
            query: () => ({
                url: `${CHAT_URL}/fetchmessage`,
                method: "GET",
            }),
        }),
        sendMessage: builder.mutation({
            query: (data) => ({
                url: `${CHAT_URL}/writemessage`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useFetchMessagesQuery, useSendMessageMutation } = chatApi;
