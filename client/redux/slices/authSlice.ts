import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { base_url } from "../../src/utils/utils"

export const authAPI = createApi({
    reducerPath:'authAPI',
    baseQuery: fetchBaseQuery({baseUrl:base_url,
        prepareHeaders:(headers)=>{
            headers.set('credentials','include');
            return headers
        },
        credentials:'include'
    }),
    endpoints:(builder)=>({
        userLogin:builder.mutation({
            query:(data)=>({
                url:'/auth/login',
                method:'POST',
                body:data
            })
        }),
        userSignup:builder.mutation({
            query:(data)=>({
                url:'/auth/signup',
                method:'POST',
                body:data
            })
        })
    })
})

export const {useUserLoginMutation,useUserSignupMutation} = authAPI