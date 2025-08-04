/**
 * @module AssumptionsAPIClient
 *
 * Provides an API client for interacting with the assumptions extraction service.
 * Sends user prompt, AI response, and provider identifier to the configured endpoint
 * and returns structured reasoning results.
 */

/**
 * @typedef {import('./IReasoningAPIClient').ReasoningResult} ReasoningResult
 */

import { CONFIG } from "../config/constants";

/**
 * Client to communicate with the assumptions extraction backend API.
 */
export class AssumptionsAPIClient {
    /**
     * Creates an instance of AssumptionsAPIClient.
     *
     * @param {string} provider - The provider identifier (e.g., 'openai', 'chatgpt').
     * @param {string} [apiEndpoint=CONFIG.API_ENDPOINT] - Optional API endpoint override.
     */
    constructor(provider, apiEndpoint = CONFIG.API_ENDPOINT) {
        this.apiEndpoint = apiEndpoint;
        this.provider = provider;
    }

    /**
     * Sends the user's prompt, AI response, and provider to the reasoning API
     * to extract assumptions.
     * @param {string} prompt - The user prompt text.
     * @param {string} response - The AI response text.
     * @returns {Promise<ReasoningResult>} The result object with success status and data or error message.
     */
    async extractReasoning(prompt, response) {
        if (!this.provider) {
            throw new Error("Provider is required for extracting reasoning.");
        }

        try {
            const payload = { prompt, response, provider: this.provider };

            const res = await fetch(this.apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            return { success: true, data };
        } catch (error) {
            console.error("API Error:", error);
            return { success: false, error: error.message || "Unknown error" };
        }
    }
}
