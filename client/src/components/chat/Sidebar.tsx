import React, { useEffect, useState } from 'react'
import sidebaricon from '../../assets/Chats/sidebar.svg'
import { UUID } from 'crypto'
import { determineDay } from '../../utils/DateOperations';

interface conversationType {
    createdAt: Date;
    id: UUID
    topic: string;
    updatedAt: Date
    user_id: UUID
}

interface conversationResponse {
    status: boolean;
    message: string;
    data: conversationType[]
}

interface SideBarProps {
    conversationData: conversationResponse;
    isSideVisible: any;
    toggleSideVisibility: () => void;
    setNewConvo:(data:conversationType | string)=>void;
}

const Sidebar: React.FC<SideBarProps> = ({ isSideVisible, toggleSideVisibility, conversationData,setNewConvo }) => {
    console.log('Conversation Data in sidebar :', conversationData)

    const [today, setToday] = useState<conversationType[]>([])
    const [yesterday, setYesterday] = useState<conversationType[]>([])
    const [other, setOther] = useState<conversationType[]>([])

    useEffect(() => {
        const segregateData = async () => {
            const today: conversationType[] = [];
            const yesterday: conversationType[] = []
            const other: conversationType[] = [];

            conversationData?.data?.map(async (item) => {
                const response = await determineDay(item?.createdAt)

                if (response === 'today') {
                    today.push(item)
                } else if (response === 'yesterday') {
                    yesterday.push(item)
                } else {
                    other.push(item)
                }

                setToday(today)
                setYesterday(yesterday)
                setOther(other)
            })
        }

        segregateData()
    }, [conversationData])

    const sideBarclass = 'h-full bg-black'
    const convoClass = 'w-full h-[48px] rounded-[10px] bg-[#373737] mb-[20px] flex items-center px-[20px] cursor-pointer'
    const dateClass = 'text-[#373737] mt-[10px] mb-[5px]'

    return (
        <div className={`${sideBarclass} ${isSideVisible ? 'w-[372px] p-[16px] transition ease-in-out duration-300' : 'hidden'}`}>
            <div className='flex justify-between w-full'>
                <img src={sidebaricon} alt="" onClick={toggleSideVisibility} />
                <button className='w-[100px] h-[28px] bg-[white] rounded-[20px]' type='button'
                onClick={()=>setNewConvo('Not selected')}
                >New Chat</button>
            </div>
            <div className='w-full max-h-[80vh] mt-[50px] overflow-y-scroll'>
                {/* today */}
                <p className={dateClass}>Today</p>
                {today && today?.map((item, index) => {
                    return (
                        <div className={convoClass} key={index}
                        onClick={()=>{
                            setNewConvo(item)
                        }}
                        >
                            <p className='truncate max-w-[300px] text-[#FFFFFF]'>{item?.topic}</p>
                        </div>
                    )
                })}
                {/* yesterday */}

                {yesterday.length !== 0 && <p className={dateClass}>Yesterday</p>}
                {yesterday && yesterday?.map((item, index) => {
                    return (
                        <div className={convoClass} key={index}
                        onClick={()=>{
                            setNewConvo(item)
                        }}
                        >
                            <p className='truncate max-w-[300px] text-[#FFFFFF]'>{item?.topic}</p>
                        </div>
                    )
                })}
                {/* other */}
                {other.length !== 0  && <p className={dateClass}>Previous 30 Days</p>}
                {other && other?.map((item, index) => {
                    return (
                        <div className={convoClass} key={index}
                        onClick={()=>{
                            setNewConvo(item)
                        }}
                        >
                            <p className='truncate max-w-[300px] text-[#FFFFFF]'>{item?.topic}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Sidebar