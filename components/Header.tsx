import React from 'react';
import type { ModelType } from '../types';

interface HeaderProps {
    onOpenMcpManager: () => void;
    onOpenApiKeyModal: () => void;
    selectedModel: ModelType;
    onModelChange: (model: ModelType) => void;
}

const DatabaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7a8 8 0 0116 0" />
    </svg>
);

const CogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ onOpenMcpManager, onOpenApiKeyModal, selectedModel, onModelChange }) => {
    return (
        <header className="bg-white shadow-md z-10">
            <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        C
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">CBOT.pt Pro</h1>
                        <p className="text-sm text-slate-500">Assistente de Contabilidade</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                     <select
                        value={selectedModel}
                        onChange={(e) => onModelChange(e.target.value as ModelType)}
                        className="text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border-transparent py-2 pl-3 pr-8"
                     >
                        <option value="gemini-2.5-flash">Modelo Flash</option>
                        <option value="gemini-2.5-pro">Modelo Pro</option>
                     </select>
                     <button
                        onClick={onOpenMcpManager}
                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-label="Gerir a Base de Conhecimento (MCP)"
                    >
                        <DatabaseIcon />
                        <span className="hidden sm:inline">Gerir MCP</span>
                    </button>
                    <button
                        onClick={onOpenApiKeyModal}
                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-label="Configurações"
                    >
                        <CogIcon />
                    </button>
                </div>
            </div>
        </header>
    );
};