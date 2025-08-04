/**
 * Interface describing an adapter for interacting with an LLM frontend.
 * @interface LLMFrontendAdapterInterface
 */

// An interface when migrating to Typescript in the future
export class LLMFrontendAdapterInterface {
    /**
     * Unique identifier for this frontend adapter (e.g., "chatgpt").
     * @type {string}
     */
    name;

    /**
     * Detects whether this frontend is active on the current page.
     * @returns {boolean} True if detected, false otherwise.
     */
    detectPage() {
        throw new Error('Method "detectPage" must be implemented.');
    }

    /**
     * Gets the DOM element where extension buttons should be injected.
     * @returns {HTMLElement|null} The container element or null if not found.
     */
    getFooterContainer() {
        throw new Error('Method "getFooterContainer" must be implemented.');
    }

    /**
     * Inserts the given prompt text into the LLM input area.
     * @param {string} promptText The prompt text to insert.
     * @returns {void}
     */
    insertPrompt(promptText) {
        throw new Error('Method "insertPrompt" must be implemented.');
    }
}
