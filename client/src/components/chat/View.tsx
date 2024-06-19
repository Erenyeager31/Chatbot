import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Chats from './Chats'
import { useGetConversationQuery } from '../../../redux/slices/chatSlice'
import {UUID} from 'crypto'

interface conversationType {
    createdAt: Date;
    id: UUID
    topic: string;
    updatedAt: Date
    user_id: UUID
}

export default function View() {
    const { data: ConversationData, isError: isConversationError, error: ConversationError, refetch: Conversationrefetch } = useGetConversationQuery();

    useEffect(() => {
        if (isConversationError) {
            Conversationrefetch()
        }
    }, [ConversationData])

    const [isSideVisible, setSideVisibile] = useState<boolean>(false)
    const [selectedConvo,setConvo] = useState<conversationType | string>('Not selected')

    const toggleSideVisibility = () => {
        setSideVisibile(!isSideVisible)
    }

    const setNewConvo = (data:conversationType | string) =>{
        setConvo(data)
    }

    return (
        <div className='w-full h-full flex'>
            <Sidebar isSideVisible={isSideVisible} toggleSideVisibility={toggleSideVisibility} conversationData={ConversationData} setNewConvo={setNewConvo}/>
            <Chats isSideVisible={isSideVisible} toggleSideVisibility={toggleSideVisibility} selectedConvo={selectedConvo} Conversationrefetch={Conversationrefetch} setNewConvo={setNewConvo}/>
        </div>
    )
}
