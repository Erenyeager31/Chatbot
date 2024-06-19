import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { base_url } from "../../src/utils/utils";
import Cookies from "js-cookie";

export const chatAPI = createApi({
  reducerPath: "chatAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    credentials: "include",
    prepareHeaders: (headers) => {
      const sessionID = Cookies.get("sessionID");
      if (sessionID) {
        headers.set("Cookie", `sessionID=${sessionID}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getConversation: builder.query<any, void>({
      query: () => "/chat/getConversations",
    }),
    getChats: builder.mutation({
      query: (data) => ({
        url: "/chat/getChats",
        method: "POST",
        body: data,
      }),
    }),
    getUserDetails: builder.query<any, void>({
      query: () => "/getUserDetails",
    }),
  }),
});

export const { useGetConversationQuery, useGetChatsMutation,useGetUserDetailsQuery } = chatAPI;
