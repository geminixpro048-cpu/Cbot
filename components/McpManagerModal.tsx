import React, { useState, useEffect } from 'react';
import type { McpEntry } from '../types';

interface McpManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    mcpData: McpEntry[];
    onSave: (updatedData: McpEntry[]) => void;
}

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
    </svg>
);
const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const McpManagerModal: React.FC<McpManagerModalProps> = ({ isOpen, onClose, mcpData, onSave }) => {
    const [localData, setLocalData] = useState<McpEntry[]>([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editQuestion, setEditQuestion] = useState('');
    const [editAnswer, setEditAnswer] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLocalData([...mcpData]);
        }
    }, [mcpData, isOpen]);

    if (!isOpen) return null;

    const handleAdd = () => {
        if (newQuestion.trim() && newAnswer.trim()) {
            const newData = [...localData, { question: newQuestion, answer: newAnswer }];
            setLocalData(newData);
            onSave(newData);
            setNewQuestion('');
            setNewAnswer('');
        }
    };

    const handleDelete = (index: number) => {
        const newData = localData.filter((_, i) => i !== index);
        setLocalData(newData);
        onSave(newData);
    };

    const startEdit = (index: number) => {
        setEditIndex(index);
        setEditQuestion(localData[index].question);
        setEditAnswer(localData[index].answer);
    };

    const handleUpdate = () => {
        if (editIndex !== null && editQuestion.trim() && editAnswer.trim()) {
            const newData = [...localData];
            newData[editIndex] = { question: editQuestion, answer: editAnswer };
            setLocalData(newData);
            onSave(newData);
            setEditIndex(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-bold text-slate-800">Gestor da Base de Conhecimento (MCP)</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl font-bold">&times;</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {/* Add New Entry Form */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <h3 className="font-semibold mb-3 text-slate-700">Adicionar Novo Conhecimento</h3>
                        <div className="space-y-3">
                            <input type="text" placeholder="Pergunta do utilizador" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                            <textarea placeholder="Resposta do assistente" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md h-24 resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                            <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:bg-slate-400" disabled={!newQuestion.trim() || !newAnswer.trim()}>Adicionar ao MCP</button>
                        </div>
                    </div>
                    
                    {/* MCP Data Table */}
                    <div className="space-y-4">
                        {localData.map((entry, index) => (
                            <div key={index} className="bg-white border border-slate-200 p-4 rounded-lg text-sm">
                                {editIndex === index ? (
                                    <div className="space-y-2 bg-blue-50 p-3 rounded-md border border-blue-200">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 block mb-1">Pergunta</label>
                                            <input type="text" value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 block mb-1">Resposta</label>
                                            <textarea value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md h-28 resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                                        </div>
                                        <div className="flex space-x-2 pt-2">
                                            <button onClick={handleUpdate} className="px-3 py-1 bg-green-500 text-white rounded font-semibold text-xs hover:bg-green-600">Guardar</button>
                                            <button onClick={() => setEditIndex(null)} className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300">Cancelar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="font