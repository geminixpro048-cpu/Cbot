import { GoogleGenAI, Chat } from "@google/genai";
import type { ModelType } from "../types";

const SYSTEM_INSTRUCTION = `Você é um assistente de IA especialista em contabilidade e fiscalidade para Portugal, representando o site cbot.pt. O seu objetivo é fornecer informações precisas, claras e atualizadas sobre as leis fiscais, obrigações declarativas, e práticas contabilísticas em Portugal.
- Responda sempre em português de Portugal.
- Seja profissional, mas acessível.
- Quando uma questão for ambígua, peça esclarecimentos.
- Não forneça conselhos financeiros ou de investimento, foque-se estritamente na informação contabilística e fiscal.
- Baseie as suas respostas na legislação portuguesa em vigor.
- Estruture respostas complexas com listas ou parágrafos curtos para facilitar a leitura.`;

export const createChatSession = (apiKey: string, model: ModelType): Chat => {
    if (!apiKey) {
        throw new Error("API_KEY not provided.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const chat: Chat = ai.chats.create({
        model,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
    });

    return chat;
};