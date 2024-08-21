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
        putStatus: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/putstatus`,
                method: "PUT",
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
        updateDesc: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/updatedescription`,
                method: "PUT",
                body: data,
            })
        }),
        updateSubTaskDesc: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/updatesubdescription`,
                method: "PUT",
                body: data,
            })
        }),
        postActivity: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/activity`,
                method: "POST",
                body: data,
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
                url: `${USER_URL}/getadmintask`,
                method: "POST",
            })
        }),
        getUserTask: builder.query({
            query: () =>({
                url: `${USER_URL}/getusertask`,
                method: "POST",
            })
        }),
        addMedia: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/addmedia`,
                method: "PUT",
                body: data,
            })
        }),
        getTaskDetails: builder.query({
            query: (id) => ({
                url: `${USER_URL}/getdetails/${id}`,
                method: "GET",
            })
        }),
        delTask: builder.mutation({
            query: ({id}) => ({
                url: `${USER_URL}/delete/${id}`,
                method: "PUT",
            })
        }),
        delMedia: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/deletemedia`,
                method: "PUT",
                body: data,
            })
        }),
        delSubMedia: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/deletesubmedia`,
                method: "PUT",
                body: data,
            })
        }),
        getSubtask: builder.query({
            query: ({taskId, subId}) => ({
                url: `${USER_URL}/getsubdetails/${taskId}/${subId}`,
                method: "GET",
            })
        }),

    }),
});

export const { 
    useAddTaskMutation, 
    useDelTaskMutation, 
    useGetTaskDetailsQuery, 
    useGetTaskQuery, 
    useAddSubTaskMutation, 
    useDeleteSubtaskMutation,
    useUpdateDescMutation,
    usePostActivityMutation,
    useUpdateSubTaskDescMutation,
    useGetUserTaskQuery,
    useAddMediaMutation,
    useDelMediaMutation,
    useDelSubMediaMutation,
    useGetSubtaskQuery,
    usePutStatusMutation,
} =  taskApi;