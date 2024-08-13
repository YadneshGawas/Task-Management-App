import { apiSlice } from "../apiS";

const USER_URL = "/project";

export const projApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addProject: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/createproject`,
                method: "POST",
                body: data,
            })
        }),
        getProject: builder.query({
            query: () =>({
                url: `${USER_URL}/getproject`,
                method: "GET",
            })
        }),
        getAProject: builder.query({
            query: (projectId) =>({
                url: `${USER_URL}/getaproject/${projectId}`,
                method: "GET",
            })
        }),
        getTasks: builder.query({
            query: (id) => ({
                url: `${USER_URL}/getTasks/${id}`,
                method: "GET",
            })
        }),
        delProj: builder.mutation({
            query: ({id}) => ({
                url: `${USER_URL}/delete/${id}`,
                method: "PUT",
            })
        }),
    }),
});

export const { 
    useAddProjectMutation, 
    useGetProjectQuery, 
    useGetTasksQuery, 
    useDelProjMutation,
    useGetAProjectQuery 
} =  projApi;