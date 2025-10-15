import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const emptySplitApi = createApi({
  reducerPath: 'mesafacilApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // ajusta si tu front no proxy
  endpoints: () => ({}),
});
