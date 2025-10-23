import type { McpEntry } from '../types';

const MCP_STORAGE_KEY = 'cbot_mcp_data';

/**
 * Retrieves the entire MCP dataset from localStorage.
 */
export const getMcpData = (): McpEntry[] => {
    try {
        const data = localStorage.getItem(MCP_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Failed to parse MCP data from localStorage:", error);
        return [];
    }
};

/**
 * Saves the entire MCP dataset to localStorage.
 */
export const saveMcpData = (data: McpEntry[]): void => {
    try {
        localStorage.setItem(MCP_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save MCP data to localStorage:", error);
    }
};

/**
 * Adds a new entry to the MCP dataset.
 */
export const addMcpEntry = (entry: McpEntry): void => {
    const data = getMcpData();
    // Avoid adding duplicates
    const exists = data.some(item => item.question.trim().toLowerCase() === entry.question.trim().toLowerCase());
    if (!exists) {
        data.push(entry);
        saveMcpData(data);
    }
};

/**
 * Finds an answer in the MCP for a given question.
 * Returns the answer string or null if not found.
 */
export const findInMcp = (question: string): string | null => {
    const data = getMcpData();
    const query = question.trim().toLowerCase();
    const found = data.find(entry => entry.question.trim().toLowerCase() === query);
    return found ? found.answer : null;
};
