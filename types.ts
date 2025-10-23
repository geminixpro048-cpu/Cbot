export enum Role {
    USER = 'user',
    MODEL = 'model',
}

export type ModelType = 'gemini-2.5-flash' | 'gemini-2.5-pro';

export interface Message {
    role: Role;
    text: string;
    fileName?: string;
    isError?: boolean;
    source?: 'MCP' | 'Gemini API';
}

export interface McpEntry {
    question: string;
    answer: string;
}