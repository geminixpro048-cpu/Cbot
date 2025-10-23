import React from 'react';
import type { Message } from '../types';
import { Role } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface ChatMessageProps {
    message: Message;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ModelIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === Role.USER;
    const isModelLoading = !isUser && message.text.trim().length === 0 && !message.isError;

    const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
    
    let messageBoxClasses = isUser
        ? 'bg-blue-600 text-white'
        : 'bg-slate-200 text-slate-800';

    if (message.isError) {
        messageBoxClasses = 'bg-red-100 text-red-700 border border-red-200';
    }
    
    const iconContainerClasses = isUser ? 'bg-blue-600' : 'bg-slate-700';
    const iconOrderClass = isUser ? 'order-2' : 'order-1';
    const messageOrderClass = isUser ? 'order-1 mr-2' : 'order-2 ml-2';

    const sourceBadge = message.source === 'MCP' 
        ? <span className="text-xs font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">Fonte: MCP</span>
        : <span className="text-xs font-semibold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">Fonte: Gemini API</span>;

    return (
        <div className={`${containerClasses} items-end`}>
            <div className={`flex items-start max-w-lg md:max-w-2xl`}>
                 <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconContainerClasses} ${iconOrderClass}`}>
                    {isUser ? <UserIcon /> : <ModelIcon />}
                </div>
                <div
                    className={`rounded-lg p-3 shadow-sm ${messageOrderClass} flex flex-col`}
                >
                     {!isUser && (
                        <div className="mb-2">
                           {sourceBadge}
                        </div>
                    )}
                    <div className={`${messageBoxClasses} rounded-lg p-3 -m-3 mt-0`}>
                        {message.fileName && (
                            <div className="mb-2 p-2 bg-blue-500/80 rounded-md text-white text-xs flex items-center font-medium">
                                <FileIcon />
                                <span className="truncate">{message.fileName}</span>
                            </div>
                        )}
                        {isModelLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};