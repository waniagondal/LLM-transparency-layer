/**
 * @module ButtonComponent
 *
 * @description
 * Manages injecting and controlling the GlassOS button inside the ChatGPT UI.
 * Only activates if the ChatGPT frontend is detected via the provided LLM frontend adapter.
 */

import {Utilities} from "../../../utils/utilities";
import {CONFIG} from "../../../infrastructure/config/constants";
import {StylesManager} from "../../styles/styles-manager";

/**
 * @typedef {import('./IPanelManager').IPanelManager} IPanelManager
 * @typedef {import('../../../infrastructure/llm-frontend-adapter/ILLMFrontendAdapter').ILLMFrontendAdapter} ILLMFrontendAdapter
 */


export class OpenAIButtonComponent {
    /**
     * @param {IPanelManager} panelManager Reference to panel manager for showing panel on button click.
     * @param {ILLMFrontendAdapter} llmFrontend Frontend adapter for ChatGPT-specific detection and container queries.
     */
    constructor(panelManager, llmFrontend) {
        /** @private @type {HTMLElement|null} */
        this.button = null;

        /** @private @type {MutationObserver|null} */
        this.observer = null;

        this.panelManager = panelManager;
        this.llmFrontend = llmFrontend;

        if (this.llmFrontend.detectPage()) {
            StylesManager.inject();
            this.init();
        } else {
            console.warn('[ButtonManager] ChatGPT frontend not detected; button injection skipped.');
        }
    }

    /**
     * Initialize the button manager by starting DOM observation.
     */
    init() {
        this.startObserving();
    }

    /**
     * Create the button element with logo and text, and bind click handler.
     * @private
     * @returns {HTMLElement}
     */
    create() {
        if (this.button) return this.button;

        const logoHTML = `<img src="${chrome.runtime.getURL('logo.png')}" width="25" height="25" style="border-radius:50%"/>`;
        const wrapper = Utilities.createElement('div', 'custom-wrapper');
        wrapper.id = CONFIG.BUTTON_ID;

        const button = Utilities.createElement('button', '', logoHTML + '' +
            '<span style="margin-left:2px;">GlassOS</span>');
        button.addEventListener('click', () => this.panelManager.show());

        wrapper.appendChild(button);
        this.button = wrapper;
        return wrapper;
    }

    /**
     * Inject the button into the footer container provided by the ChatGPT frontend adapter.
     * @private
     */
    inject() {
        const footer = this.llmFrontend.getFooterContainer();

        if (!footer) {
            // Footer container not found, skip injection.
            return;
        }

        if (document.getElementById(CONFIG.BUTTON_ID)) {
            // Button already injected.
            return;
        }

        const button = this.create();
        footer.prepend(button);
    }

    /**
     * Start observing DOM mutations to inject button dynamically when footer appears.
     * @private
     */
    startObserving() {
        this.observer = new MutationObserver(() => this.inject());
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        // Initial injection attempt
        this.inject();
    }

    /**
     * Clean up observers, event listeners, and remove button element.
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.button) {
            this.button.remove();
            this.button = null;
        }
    }
}
