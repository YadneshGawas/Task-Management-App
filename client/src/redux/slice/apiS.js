/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_BASE_APP_URL ;

console.log(API_URL)

const baseQuery = fetchBaseQuery({ baseUrl: `${API_URL}/api`, credentials:'include'});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});
