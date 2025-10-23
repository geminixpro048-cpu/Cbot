import React, { useState, useEffect, useRef } from 'react';
import type { Chat, Part } from '@google/genai';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { createChatSession } from './services/geminiService';
import { Role } from './types';
import type { Message, McpEntry, ModelType } from './types';
import { McpManagerModal } from './components/McpManagerModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import * as mcpService from './services/mcpService';

const fileToGenerativePart = (file: File): Promise<Part> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = (reader.result as string).split(',')[1];
            if (!base64Data) {
                reject(new Error("Failed to read file data."));
                return;
            }
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
};

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: Role.MODEL,
            text: 'Olá! Sou o seu assistente de contabilidade da CBOT.pt. O meu conhecimento é reforçado por uma base de dados interna (MCP). Como posso ajudar?',
            source: 'Gemini API',
        },
    ]);
    const [chat, setChat] = useState<Chat | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mcpData, setMcpData] = useState<McpEntry[]>([]);
    const [isMcpManagerOpen, setIsMcpManagerOpen] = useState<boolean>(false);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
    const [model, setModel] = useState<ModelType>('gemini-2.5-flash');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedApiKey = localStorage.getItem('google_api_key');
        if (savedApiKey) {
            setApiKey(savedApiKey);
        } else {
            setIsApiKeyModalOpen(true);
        }
        setMcpData(mcpService.getMcpData());
    }, []);

    useEffect(() => {
        if (apiKey) {
            try {
                const newChat = createChatSession(apiKey, model);
                setChat(newChat);
                // Reset chat history when model changes
                 setMessages([
                    {
                        role: Role.MODEL,
                        text: `Sessão iniciada com o modelo ${model === 'gemini-2.5-pro' ? 'Pro' : 'Flash'}. Como posso ajudar?`,
                        source: 'Gemini API',
                    },
                ]);
            } catch (e) {
                console.error("Failed to initialize chat session:", e);
                const errorMessage = "Não foi possível iniciar a sessão de chat. Verifique a sua chave de API.";
                setMessages((prev) => [...prev, { role: Role.MODEL, text: errorMessage, isError: true, source: 'Gemini API' }]);
            }
        }
    }, [apiKey, model]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);
    
    const handleSaveApiKey = (key: string) => {
        if(key) {
            setApiKey(key);
            localStorage.setItem('google_api_key', key);
            setIsApiKeyModalOpen(false);
        }
    };

    const handleSendMessage = async (inputText: string, file: File | null) => {
        if ((!inputText.trim() && !file) || isLoading || !chat) {
            return;
        }

        const newUserMessage: Message = { role: Role.USER, text: inputText, fileName: file?.name };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setIsLoading(true);

        const cachedAnswer = mcpService.findInMcp(inputText);
        if (cachedAnswer && !file) {
            setMessages((prev) => [...prev, { role: Role.MODEL, text: cachedAnswer, source: 'MCP' }]);
            setIsLoading(false);
            return;
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            { role: Role.MODEL, text: '', source: 'Gemini API' },
        ]);

        try {
            const promptParts: Part[] = [{ text: inputText }];
            if (file) {
                const filePart = await fileToGenerativePart(file);
                promptParts.push(filePart);
            }
            
            const stream = await chat.sendMessageStream({ message: promptParts });

            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setMessages((prevMessages) => {
                    const newMessages = [...prevMessages];
                    newMessages[newMessages.length - 1].text = fullResponse;
                    return newMessages;
                });
            }

            if (!file) {
                const newEntry = { question: inputText, answer: fullResponse };
                mcpService.addMcpEntry(newEntry);
                setMcpData(mcpService.getMcpData());
            }

        } catch (e) {
            console.error('Error sending message to Gemini:', e);
            const errorMessage = 'Ocorreu um erro ao comunicar com o assistente. Verifique se a sua Chave de API é válida e tente novamente.';
            
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.role === Role.MODEL) {
                    lastMessage.text = errorMessage;
                    lastMessage.isError = true;
                }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleMcpUpdate = (updatedData: McpEntry[]) => {
        mcpService.saveMcpData(updatedData);
        setMcpData(updatedData);
    };

    if (!apiKey) {
        return <ApiKeyModal isOpen={true} onSave={handleSaveApiKey} />;
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans">
            <Header 
                onOpenMcpManager={() => setIsMcpManagerOpen(true)}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
                selectedModel={model}
                onModelChange={setModel}
            />
            <main
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
            >
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
            </main>
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            <McpManagerModal
                isOpen={isMcpManagerOpen}
                onClose={() => setIsMcpManagerOpen(false)}
                mcpData={mcpData}
                onSave={handleMcpUpdate}
            />
            <ApiKeyModal
                isOpen={isApiKeyModalOpen}
                onSave={handleSaveApiKey}
                onClose={() => setIsApiKeyModalOpen(false)}
            />
        </div>
    );
};

export default App;