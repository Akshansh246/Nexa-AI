/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import ReactMarkdown from "react-markdown";
import TypingText from "../utils/TypingText";

const Dashboard = () => {
    const chat = useChat();
    const { user } = useSelector((state) => state.auth);
    const [chatInput, setChatInput] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [typedText, setTypedText] = useState("");
    let isLastMessage = false
    const chatEndRef = useRef(null);

    const chats = useSelector((state) => state.chat.chats )
    const currentChatId = useSelector((state) => state.chat.currentChatId)
    // const isLoading = useSelector((state) => state.chat.isLoading)

    useEffect(() => {
        chat.initializeSocketConnection();
        chat.handleGetChats()
    }, []);


    const containerRef = useRef(null);
    const isScrollingRef = useRef(false);

    const scrollToBottom = () => {
        if (isScrollingRef.current) return;

        isScrollingRef.current = true;

        requestAnimationFrame(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            isScrollingRef.current = false;
        });
    }

    useEffect(() => {
        scrollToBottom();
    }, [chats, currentChatId]);


    function handleSubmit(e){
        e.preventDefault()

        const trimmedMessage = chatInput.trim()
        if(!trimmedMessage){
            return
        }

        chat.handleSendMessage({message:trimmedMessage, chatId:currentChatId})
        setChatInput('')
    }

    const openChats = (chatId) =>{
        chat.handleOpenChat(chatId, chats)
    }

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        const touchX = e.targetTouches[0].clientX;

        // only start if near left edge (0–30px)
        if (!isSidebarOpen && touchX > 30) return;

        setTouchEnd(null);
        setTouchStart(touchX);
        };

        const onTouchMove = (e) => {
            setTouchEnd(e.targetTouches[0].clientX);
        };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchEnd - touchStart;

        // 👉 swipe right (open)
        if (distance > minSwipeDistance) {
            setIsSidebarOpen(true);
        }

        // 👉 swipe left (close)
        if (distance < -minSwipeDistance) {
            setIsSidebarOpen(false);
        }
    };


    return (
        <div className="bg-linear-to-br flex from-[#020617] via-nexa-dark to-nexa-primary w-screen h-screen text-white"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        >
        <aside
            className={`
                absolute top-0 left-0 h-full w-3/4 z-50
                bg-nexa-dark transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}

                lg:static lg:translate-x-0 lg:w-1/6 lg:flex flex-col
            `}
            >
            <div className="flex h-9/10 lg:h-full flex-col lg:justify-between px-4 py-7">
                <div className="flex border-b pb-5">
                    <img
                    className="w-15"
                    src="https://ik.imagekit.io/devakshu/logo.png"
                    alt="NEXA"
                    />
                </div>
                <div className=" h-160 overflow-auto">
                    <h3 className="font-bold text-2xl mb-2">Recent Chats</h3>
                    <div className="w-full flex flex-col-reverse gap-1">
                        {Object.values(chats).map((chat,index)=>(
                            <button
                                onClick={()=>{
                                    openChats(chat.id)
                                    setIsSidebarOpen(false)
                                }}
                                key={index}
                                className="w-full text-left p-2 rounded-lg cursor-pointer hover:bg-nexa-tertiary/20"
                            >
                                {chat.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex gap-3 border-t border-nexa-tertiary-dark px-4 py-6 items-center">
                <div className="uppercase bg-nexa-primary-dark w-fit text-2xl py-2 px-3 rounded-full border-2 border-nexa-tertiary-dark ">
                    {user.username.slice(0, 2)}
                </div>
                <p className="capitalize font-bold text-2xl">{user.username}</p>
                <p className="text-white font-semibold text-lg"><sup>PRO</sup></p>
            </div>
        </aside>

        <div className="w-full h-full relative flex flex-col items-center justify-between ">
            <div className="flex items-center justify-between lg:justify-end  w-full px-5 py-3">
                <svg onClick={() => setIsSidebarOpen(true)} className="w-8 cursor-pointer lg:hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.9997 4H6.99967V6H20.9997V4ZM20.9997 11H10.9997V13H20.9997V11ZM20.9997 18H6.99967V20H20.9997V18ZM1.98926 8.81412L3.40347 7.3999L7.99967 11.9961L3.40347 16.5923L1.98926 15.1781L5.17124 11.9961L1.98926 8.81412Z"></path></svg>
                <div className="flex gap-3">
                    <svg
                        className="w-8 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM13 13.3551C14.4457 12.9248 15.5 11.5855 15.5 10C15.5 8.067 13.933 6.5 12 6.5C10.302 6.5 8.88637 7.70919 8.56731 9.31346L10.5288 9.70577C10.6656 9.01823 11.2723 8.5 12 8.5C12.8284 8.5 13.5 9.17157 13.5 10C13.5 10.8284 12.8284 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5V14H13V13.3551Z"></path>
                    </svg>
                    <svg
                        className="w-8 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                    <path d="M23.9996 12.0235C17.5625 12.4117 12.4114 17.563 12.0232 24H11.9762C11.588 17.563 6.4369 12.4117 0 12.0235V11.9765C6.4369 11.5883 11.588 6.43719 11.9762 0H12.0232C12.4114 6.43719 17.5625 11.5883 23.9996 11.9765V12.0235Z"></path>
                    </svg>
                </div>
            </div>

            <div ref={containerRef} className="overflow-auto w-full px-8 lg:px-25 h-full bg-nexa-dark/50 backdrop-blur-lg ">
            {chats[currentChatId]?.messages.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-5">
                    <p className="text-nexa-primary font-semibold text-lg">No Chats Yet. Start the conversation!</p>
                </div>
            ): 
            chats[currentChatId]?.messages.map((msg) => (
                <div className="flex items-start gap-2" ref={chatEndRef}>
                    {isLastMessage = chats[currentChatId]?.messages.indexOf(msg) === chats[currentChatId]?.messages.length - 1}
                    {msg.role === "ai" ? (
                        <div className="bg-nexa-primary p-2 rounded-full">
                            <svg
                                className="w-7 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
                            </svg>
                        </div>
                        ):null}
                    <div
                        key={msg.id}
                        className={` px-3 text-xl mb-5 rounded-2xl ${
                        msg.role === "user"
                            ? "bg-nexa-secondary-dark/40 backdrop-blur-lg text-white ml-auto max-w-xl p-3"
                            : "mr-auto text-white bg-white/5 backdrop-blur-lg p-4 px-4 rounded-2xl border border-white/10 lg:w-3/4"
                        }`}
                    >
                        {msg.role === "ai" ? (
                            msg.isThinking ? (
                                <div className="flex items-center gap-2 text-gray-400 italic">
                                <span>Nexa is thinking</span>
                                <span className="animate-pulse">...</span>
                                </div>
                            ) : (
                            <>
                            {isLastMessage && (
                                <TypingText text={msg.content} onUpdate={setTypedText} />
                                )}
                            <ReactMarkdown
                            components={{
                            h1: ({ children }) => (
                                <h1 className="text-2xl font-bold text-nexa-primary mb-3">
                                {children}
                                </h1>
                            ),

                            h2: ({ children }) => (
                                <h2 className="text-xl font-semibold text-nexa-secondary mb-2">
                                {children}
                                </h2>
                            ),

                            h3: ({ children }) => (
                                <h3 className="text-lg font-semibold text-nexa-tertiary mb-2">
                                {children}
                                </h3>
                            ),

                            p: ({ children }) => (
                                <p className="text-gray-200 leading-relaxed mb-3">
                                {children}
                                </p>
                            ),

                            strong: ({ children }) => (
                                <span className="text-nexa-primary font-semibold">
                                {children}
                                </span>
                            ),

                            // 🔥 INLINE CODE
                            code({ inline, children }) {
                                return inline ? (
                                <code className="bg-white/10 text-nexa-tertiary px-1.5 py-0.5 rounded-md text-sm font-mono">
                                    {children}
                                </code>
                                ) : (
                                <code className="block font-mono text-sm leading-relaxed whitespace-pre-wrap wrap-break-words">
                                    {children}
                                </code>
                                );
                            },

                            // 🔥 CODE BLOCK (MAIN FIX)
                            pre: ({ children }) => (
                                <div className="relative my-4 max-w-full overflow-hidden rounded-xl border border-white/10 bg-[#020617]">
                                
                                {/* top bar */}
                                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
                                    <span className="text-xs text-gray-400 font-mono">code</span>
                                </div>

                                {/* scrollable code */}
                                <pre className="p-4 overflow-x-auto max-w-full text-gray-200 text-sm">
                                    {children}
                                </pre>
                                </div>
                            ),

                            ul: ({ children }) => (
                                <ul className="list-disc pl-5 text-gray-300 mb-3 space-y-1">
                                {children}
                                </ul>
                            ),

                            ol: ({ children }) => (
                                <ol className="list-decimal pl-5 text-gray-300 mb-3 space-y-1">
                                {children}
                                </ol>
                            ),

                            li: ({ children }) => (
                                <li className="leading-relaxed">
                                {children}
                                </li>
                            ),

                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-nexa-secondary pl-4 italic text-gray-300 my-3 bg-white/5 py-2 rounded-r-lg">
                                {children}
                                </blockquote>
                            ),
                            }}
                            >
                            {isLastMessage ? typedText : msg.content}
                            </ReactMarkdown>
                            </> )   
                        ) : (
                            <p>{msg.content}</p>
                        )}
                    </div>
                </div>
            ))}
            </div>

            <div className="w-full flex items-center justify-center bg-nexa-dark p-5">
            <div className=" flex items-center justify-between w-full lg:w-3/4 bg-nexa-dark p-2 rounded-4xl box">
                <input
                value={chatInput}
                onInput={(e)=>setChatInput(e.target.value)}
                className="w-full outline-none text-xl px-2 py-1"
                type="text"
                placeholder={`Deep Dive into Nexa...`}
                name="message"
                onKeyDown={(e)=>{
                    if(e.key === 'Enter'){
                        handleSubmit(e)
                    }
                }}
                />
                <button 
                onClick={handleSubmit}
                className="bg-nexa-primary text-nexa-dark p-3 rounded-full cursor-pointer"
                >
                <svg
                    className="w-7"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M3 12.9999H9V10.9999H3V1.84558C3 1.56944 3.22386 1.34558 3.5 1.34558C3.58425 1.34558 3.66714 1.36687 3.74096 1.40747L22.2034 11.5618C22.4454 11.6949 22.5337 11.9989 22.4006 12.2409C22.3549 12.324 22.2865 12.3924 22.2034 12.4381L3.74096 22.5924C3.499 22.7255 3.19497 22.6372 3.06189 22.3953C3.02129 22.3214 3 22.2386 3 22.1543V12.9999Z"></path>
                </svg>
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};

export default Dashboard;
