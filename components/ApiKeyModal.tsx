import React, { useState } from 'react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onSave: (apiKey: string) => void;
    onClose?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose }) => {
    const [apiKey, setApiKey] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (apiKey.trim()) {
            onSave(apiKey.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Bem-vindo ao CBOT.pt Pro</h2>
                <p className="text-slate-600 mb-4">
                    Para começar, por favor insira a sua chave de API da Google. A sua chave é guardada localmente no seu browser e nunca é partilhada.
                </p>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Cole a sua Chave de API aqui"
                    className="w-full p-3 border border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                 <p className="text-xs text-slate-500 mt-2">
                    O uso da API pode incorrer em custos. Consulte a <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">documentação de preços do Google</a>.
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                    {onClose && (
                         <button 
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!apiKey.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Guardar e Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};