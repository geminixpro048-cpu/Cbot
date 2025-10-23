
import React, { useState, useRef } from 'react';

interface ChatInputProps {
    onSendMessage: (text: string, file: File | null) => void;
    isLoading: boolean;
}

const PaperClipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);

const SendIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
     </svg>
);


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [inputText, setInputText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((inputText.trim() || file) && !isLoading) {
            onSendMessage(inputText, file);
            setInputText('');
            setFile(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };
    
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    }

    return (
        <footer className="bg-white border-t border-slate-200 p-4">
            <div className="container mx-auto px-4 md:px-6">
                {file && (
                    <div className="mb-2 text-sm text-slate-600 bg-slate-100 p-2 rounded-md flex justify-between items-center">
                        <span>Ficheiro anexado: <strong>{file.name}</strong></span>
                        <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={isLoading}
                        className="p-3 text-slate-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors rounded-full"
                        aria-label="Anexar ficheiro"
                    >
                        <PaperClipIcon />
                    </button>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escreva a sua questão ou anexe um ficheiro..."
                        className="flex-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                        rows={1}
                        disabled={isLoading}
                        style={{maxHeight: '150px'}}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || (!inputText.trim() && !file)}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                        aria-label="Enviar mensagem"
                    >
                         <SendIcon />
                    </button>
                </form>
                 <p className="text-xs text-center text-slate-400 mt-2">
                    A informação fornecida é gerada por IA e pode conter imprecisões. Consulte sempre um profissional qualificado.
                 </p>
            </div>
        </footer>
    );
};
