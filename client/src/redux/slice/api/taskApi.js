import { apiSlice } from "../apiS";

const USER_URL = "/task";

export const taskApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addTask: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/createtask`,
                method: "POST",
                body: data,
            })
        }),
        addSubTask: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/createsubtask`,
                method: "PUT",
                body: data ,
            })
        }),
        deleteSubtask: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/deletesubtask`,
                method: "PUT",
                body: data ,
            })
        }),
        getTask: builder.query({
            query: () =>({
                url: `${USER_URL}/gettask`,
                method: "POST",
            })
        }),
        getTaskDetails: builder.query({
            query: (id) => ({
                url: `${USER_URL}/getDetails/${id}`,
                method: "GET",
            })
        }),
        delTask: builder.mutation({
            query: ({id}) => ({
                url: `${USER_URL}/delete/${id}`,
                method: "PUT",
            })
        }),

    }),
});

export const { useAddTaskMutation, useDelTaskMutation, useGetTaskDetailsQuery, useGetTaskQuery, useAddSubTaskMutation, useDeleteSubtaskMutation} =  taskApi;