/**
 * @module OpenAIFrontendAdapter
 *
 * @description
 * Adapter implementation for interacting with the ChatGPT web interface.
 * This class allows injecting prompts directly into the ChatGPT input editor,
 * and determines whether the user is currently on a supported ChatGPT page.
 */

// import { LLMFrontendAdapterInterface } from "./llm-frontend-adapter-interface";

/**
 * An adapter that interacts with ChatGPT's DOM to programmatically inject prompts.
 * Implements the ILLMFrontendAdapter interface.
 */
// export class OpenAIFrontendAdapter /* implements LLMFrontendAdapterInterface */ {
export class OpenAIFrontendAdapter {
    /** A unique name for this frontend implementation */
    name = "chatgpt";

    /**
     * Determines whether the current page is a ChatGPT interface by checking for a known input element.
     * @returns {boolean} `true` if the page contains ChatGPT's input area, otherwise `false`.
     */
    detectPage() {
        return !!document.querySelector('.ProseMirror[contenteditable="true"]');
    }

    /**
     * Retrieves the footer container DOM element used for inserting buttons or other UI elements.
     * @returns {HTMLElement|null} The footer container element or `null` if not found.
     */
    getFooterContainer() {
        return document.querySelector('[data-testid="composer-footer-actions"]');
    }

    /**
     * Inserts a given prompt into ChatGPT's text editor programmatically.
     * @param {string} promptText - The prompt text to inject into the ChatGPT input field.
     */
    insertPrompt(promptText) {
        const editor = document.querySelector('.ProseMirror[contenteditable="true"]');
        if (!editor) {
            alert("Unable to find ChatGPT input area.");
            return;
        }

        // Format text as HTML paragraphs and line breaks
        editor.innerHTML = `<p>${promptText.replace(/\n/g, '<br>')}</p>`;

        // Trigger change detection and focus
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        editor.focus();
    }
}
