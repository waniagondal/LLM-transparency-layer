/**
 * @module llmFrontendAdapters
 *
 * @description
 * This module maintains a registry of LLM frontend adapter instances,
 * each responsible for detecting and interacting with a specific
 * Large Language Model UI frontend (e.g., ChatGPT, OpenAI playground).
 *
 * It provides a utility function to detect which frontend adapter
 * is active on the current page.
 */

/**
 * @typedef {import('./llm-frontend-adapter-interface').LLMFrontendAdapterInterface} LLMFrontendAdapterInterface
 */

import { OpenAIFrontendAdapter } from "./openAI-frontend-adapter";

/**
 * List of available LLM frontend adapters.
 * Each adapter knows how to detect and interact with a specific LLM UI frontend.
 * @type {LLMFrontendAdapterInterface[]}
 */
const LLM_FRONTEND_ADAPTERS = [
    new OpenAIFrontendAdapter(),
    // Future adapters (e.g., ClaudeFrontendAdapter) can be added here
];

/**
 * Detects which LLM frontend adapter is active on the current page.
 * Iterates through the registered adapters and returns the first
 * one that detects its target frontend.
 *
 * @returns {LLMFrontendAdapterInterface | null} The active adapter instance, or null if none detected.
 */
export function getActiveLLMFrontendAdapter() {
    for (const adapter of LLM_FRONTEND_ADAPTERS) {
        if (adapter.detectPage()) {
            return adapter;
        }
    }
    return null;
}
