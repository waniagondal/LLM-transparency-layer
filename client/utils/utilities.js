/**
 * @module Utilities
 *
 * @description
 * A utility class providing common helper functions like debounce,
 * HTML sanitization, selection retrieval, and DOM element creation/querying.
 */
export class Utilities {
    /**
     * Creates a debounced version of a function that delays invoking
     * until after `wait` milliseconds have elapsed since the last call.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The delay in milliseconds.
     * @returns {Function} The debounced function.
     */
    static debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Sanitizes a string by escaping HTML special characters.
     * @param {string} str - The input string to sanitize.
     * @returns {string} The sanitized HTML string.
     */
    static sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Gets the current text selection in the window, trimmed.
     * @returns {string} The selected text, or empty string if none.
     */
    static getSelection() {
        const selection = window.getSelection();
        return selection && !selection.isCollapsed ? selection.toString().trim() : '';
    }

    /**
     * Creates a new DOM element with optional class and innerHTML.
     * @param {string} tag - The tag name of the element to create.
     * @param {string} [className=''] - Optional CSS class to assign.
     * @param {string} [innerHTML=''] - Optional inner HTML content.
     * @returns {HTMLElement} The created DOM element.
     */
    static createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    /**
     * Finds the first element matching a selector within an optional parent.
     * @param {string} selector - CSS selector to query.
     * @param {ParentNode} [parent=document] - Optional parent to scope query.
     * @returns {Element|null} The first matched element or null.
     */
    static querySelector(selector, parent = document) {
        return parent.querySelector(selector);
    }

    /**
     * Finds all elements matching a selector within an optional parent.
     * @param {string} selector - CSS selector to query.
     * @param {ParentNode} [parent=document] - Optional parent to scope query.
     * @returns {NodeListOf<Element>} List of matched elements.
     */
    static querySelectorAll(selector, parent = document) {
        return parent.querySelectorAll(selector);
    }
}

/**
 * Detects the LLM provider name based on the adapter's constructor.
 *
 * @param {Object} adapter - The frontend adapter instance used to interact with the LLM UI.
 * @returns {string} The detected provider name. Can be 'openai', 'claude', 'gemini', or 'unknown'.
 *
 */
export function detectProvider(adapter) {
    if (!adapter || typeof adapter.constructor?.name !== 'string') return 'unknown';

    switch (adapter.constructor.name) {
        case 'OpenAIFrontendAdapter':
            return 'openai';
        default:
            return 'unknown';
    }
}
