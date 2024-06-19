import React, { useState, useEffect, useRef } from 'react';
import 'regenerator-runtime/runtime'; // Ensure the polyfill is included
import sidebar from '../../assets/Chats/sidebar.svg';
import micIcon from '../../assets/Chats/micIcon.svg';
import logoIcon from '../../assets/logo/logo.svg';
import sendIcon from '../../assets/Chats/sendIcon.svg';
import chatLogoIcon from '../../assets/Chats/logoIcon.svg';
import userIcon from '../../assets/Chats/userIcon.svg';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { UUID } from 'crypto'
import { useGetChatsMutation, useGetUserDetailsQuery } from '../../../redux/slices/chatSlice';
import { ws_url } from '../../utils/utils';

interface conversationType {
  createdAt: Date;
  id: UUID
  topic: string;
  updatedAt: Date
  user_id: UUID
}

interface chats {
  conversation_id: UUID;
  createdAt: Date;
  id: number;
  message: string;
  receiver: UUID;
  sender: UUID;
  updatedAt: Date;
}

interface chatProps {
  status?: boolean;
  message?: string;
  data?: chats[]
}

interface ChatProps {
  isSideVisible: any;
  toggleSideVisibility: () => void;
  selectedConvo: conversationType | string;
  Conversationrefetch: () => void;
  setNewConvo: (data: conversationType | string) => void;
}

const bot = "00000000-0000-0000-0000-000000000000";

const Chats: React.FC<ChatProps> = ({ isSideVisible, toggleSideVisibility, selectedConvo, Conversationrefetch, setNewConvo }) => {
  const ChatEndRef = useRef<HTMLDivElement>(null)

  const [getChats] = useGetChatsMutation()
  const { data: userdata, isError: isUserError, error: userError, refetch: userrefetch } = useGetUserDetailsQuery();

  //@ts-ignore
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setListening] = useState<boolean>(false);
  const [support, setSupport] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [Mode, setMode] = useState<number>(1);
  const [chats, setChats] = useState<chats[]>([])
  const [WS, setWS] = useState<WebSocket | undefined>(undefined)
  const [utterance, setUterance] = useState<any>(null)

  useEffect(() => {
    const synth = window.speechSynthesis
    const u = new SpeechSynthesisUtterance(message)

    setUterance(u)

    return ()=>{
      synth.cancel()
    }
  }, [message])

  useEffect(() => {
    setSupport(SpeechRecognition.browserSupportsSpeechRecognition());
  }, []);

  useEffect(() => {
    if (isUserError) {
      userrefetch()
    } else {
      console.log('user data :', userdata)
    }
  }, [userdata])

  useEffect(() => {
    if (selectedConvo === 'Not selected') {
      setChats([])
    }
  }, [selectedConvo])

  useEffect(() => {
    const fetchChats = async () => {
      const response = await getChats({
        conversation_id: (selectedConvo as conversationType)?.id
      })
      setChats(response?.data?.data)
      console.log('Chats Data:', response.data.data)
    }

    if (selectedConvo !== 'Not selected') {
      fetchChats()
    }
  }, [selectedConvo])

  const updateChats = (message: string, receiver: UUID, sender: UUID) => {
    // const prevChats = chats
    const newData = {
      conversation_id: '' as UUID,
      createdAt: new Date(),
      id: 0,
      message: message === '' ? transcript : message,
      receiver: receiver,
      sender: sender,
      updatedAt: new Date(),
    }

    setChats((prevChats) => {
      // Ensure we are creating a new array to avoid direct mutation
      return [...prevChats, newData];
    });

    ChatEndRef?.current?.scrollIntoView({ behavior: 'smooth' })

    // speaking
    if(Mode == 2){
      const synth = window.speechSynthesis;

      synth.speak(utterance)
    }
    
  }

  const sendMessage = (transcript?:any) => {
    console.log('Function',transcript,'-----------------------',message)
    const data = {
      messageType: "newMessage",
      message: message === '' ? transcript : message,
      conversation_id: (selectedConvo as conversationType)?.id,
    }

    WS?.send(JSON.stringify(data))

    setMessage('')
    updateChats(message, bot, userdata?.data?.id)
  }

  const startNewChat = () => {
    const data = {
      messageType: "newChat",
      message: message
    }

    WS?.send(JSON.stringify(data))
    setMessage("")
  }

  const startListening = () => {
    if (support) {
      SpeechRecognition.startListening({ continuous: true });
      setListening(true);
    }
    resetTranscript()
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setListening(false);
    setMessage(transcript)
    sendMessage(transcript)
    setMessage('')
    console.log(transcript,'----------------------------',message)
  };

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 1 ? 2 : 1));
  };

  //? Websocket code
  const SocketSuccess = (receivedData: any) => {
    console.log('debug')
    console.log(receivedData?.message)
  }

  const SocketFailure = (receivedData: any) => {
    // console.log('debug')
    try {
      WS?.close()
    } catch (error) {
      console.log(receivedData?.message)
    }
  }

  const newMessageSuccess = (receivedData: any) => {
    console.log('debug')
    console.log(receivedData)
    updateChats(receivedData?.message, userdata?.data?.id, bot)
  }

  const newMessageFailure = (receivedData: any) => {
    console.log('debug')
    console.log(receivedData)

    updateChats(receivedData?.message, userdata?.data?.id, bot)
  }

  const newChatSuccess = (receivedData: any) => {
    console.log('debug')
    Conversationrefetch()
    updateChats(receivedData?.message, userdata?.data?.id, bot)
    setNewConvo({
      createdAt: new Date(),
      id: receivedData?.conversation_id,
      topic: '',
      updatedAt: new Date(),
      user_id: userdata?.data?.id,
    })
  }

  const newChatFailure = (receivedData: any) => {
    console.log('debug')
    console.log(receivedData)
  }

  const messageType = {
    'SS': SocketSuccess,
    'SF': SocketFailure,
    'NCS': newChatSuccess,
    'NCF': newChatFailure,
    'NMS': newMessageSuccess,
    'NMF': newMessageFailure
  }

  useEffect(() => {
    const ws = new WebSocket(`${ws_url}?userID=${userdata?.data?.id}`)

    ws.addEventListener('open', (event) => {
      console.log(event)
    })

    ws.addEventListener('message', (event) => {
      const receivedData = JSON.parse(event?.data)
      const messageTypeData: string = receivedData?.messageType as string
      // @ts-ignore
      messageType[messageTypeData](receivedData)
    })

    setWS(ws)
  }, [])
  //? Websocket code

  const mainClass = 'w-full h-[100vh] flex flex-col p-[15px]';
  const headerClass = 'font-semibold text-[20px] text-[#ffffff9e] ml-[10px]';
  const navClass = 'flex justify-between items-center';
  const chatClass = 'w-full h-full flex flex-col justify-between items-center pt-[25px]';
  const messageClass = 'w-[700px] h-[70vh]';
  const inputClass = 'w-[700px] h-[60px] rounded-[60px] bg-[#373737] mt-[10px] px-[10px] pl-[20px] flex items-center';
  const toggleModeClass = 'bg-secondaryBG p-[5px] text-semibold text-white rounded flex justify-center items-center';
  const userChatClass = 'w-1/2 h-fit rounded-[20px] bg-[#373737] p-[10px] text-[#fff] text-justify'

  return (
    <div className={mainClass}>
      <div className={navClass}>
        <div className='flex'>
          <img src={sidebar} alt="" onClick={toggleSideVisibility} className={isSideVisible ? 'hidden' : ''} />
          <p className={headerClass}>CUSTOMER VIRTUAL ASSISTANT</p>
        </div>
        <button className={toggleModeClass} onClick={toggleMode} type='button'>
          {Mode === 1 ? 'Text Mode' : 'Speech Mode'}
        </button>
      </div>
      <div className={chatClass} style={{ paddingLeft: isSideVisible ? '30px' : '150px', paddingRight: isSideVisible ? '30px' : '150px' }}>


        {/* div for showing the actual messages of the chat */}
        <div className={`${messageClass} ${chats.length === 0 ? 'flex justify-center items-center' : ''}`}>
          {chats.length === 0 ?
            <img src={logoIcon} alt="" />
            :
            <div className='w-full h-full overflow-y-scroll'>
              {chats.length !== 0 && chats?.map((items, index) => {
                return (
                  <div key={index} className={items.sender === userdata?.data?.id ? 'w-full flex justify-end items-start mb-[10px]' : 'w-full flex flex-row-reverse justify-end items-start mb-[10px]'}>
                    <div className={userChatClass}>
                      {items?.message}
                    </div>
                    <img className={items?.sender === userdata?.data?.id ? 'pl-[5px]' : 'pr-[5px]'} src={items?.sender === userdata?.data?.id ? userIcon : chatLogoIcon} alt="" />

                    {index === chats?.length - 1 && <div ref={ChatEndRef} />}
                  </div>
                )
              })}
            </div>
          }
        </div>
        {/* div for showing the actual messages of the chat */}

        {Mode === 1 && (
          <div className={inputClass}>
            <input
              type="text"
              className='border-none outline-none w-full bg-inherit text-[white] placeholder:text-title'
              placeholder='Enter your message'
              value={message}
              name='message'
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type='button' className='w-[40px] h-[40px] rounded-[40px] bg-[white] flex justify-center items-center pl-[5px]'
              onClick={selectedConvo === 'Not selected' ? startNewChat : sendMessage}
            >
              <img src={sendIcon} alt="" />
            </button>
          </div>
        )}

        {Mode === 2 && (
          <button
            type='button'
            className='w-[40px] h-[40px] rounded-[40px] bg-[white] flex justify-center items-center pt-[5px] mt-[10px]'
            onClick={isListening ? stopListening : startListening}
          >
            <img src={micIcon} alt="" className='w-[25px] h-[25px]' />
          </button>
        )}
      </div>
    </div>
  );
}

export default Chats;