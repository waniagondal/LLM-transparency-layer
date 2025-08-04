/**
 * @module InputPage
 *
 * @description
 * This module exports the `InputPage` class, a UI component that provides
 * input text areas for the user prompt and AI response, along with Analyze and Forward buttons.
 *
 * It manages enabling/disabling the Analyze button based on input presence,
 * controls Forward button visibility, and emits events for Analyze and Forward actions.
 */

import { Utilities } from "../../utils/utilities";
import { SELECTORS, CONFIG } from "../../infrastructure/config/constants";

/**
 * Represents the input page UI for entering or highlighting user prompts and AI responses.
 */
export class InputPage {
    /**
     * Creates an instance of InputPage.
     *
     * @param {(userPrompt: string, aiResponse: string) => void} onAnalyze - Callback invoked when the Analyze button is clicked.
     * @param {() => void} onForward - Callback invoked when the Forward button is clicked.
     */
    constructor(onAnalyze, onForward) {
        this.onAnalyze = onAnalyze;
        this.onForward = onForward;

        this.container = Utilities.createElement('div', 'input-page');
        this.container.innerHTML = `
          <textarea id="user-prompt" class="bubble-input" placeholder="Enter or highlight user prompt..."></textarea>
          <textarea id="ai-response" class="bubble-input" placeholder="Enter or highlight AI response..."></textarea>
          <div class="button-row">
            <button id="analyze-btn" class="panel-button" disabled>Analyze</button>
            <button id="forward-btn" class="panel-button" style="display:none;" disabled>Forward</button>
          </div>
        `;

        this.userPrompt = this.container.querySelector(SELECTORS.USER_PROMPT);
        this.aiResponse = this.container.querySelector(SELECTORS.AI_RESPONSE);
        this.analyzeBtn = this.container.querySelector(SELECTORS.ANALYZE_BTN);
        this.forwardBtn = this.container.querySelector(SELECTORS.FORWARD_BTN);

        this.inputsChangedSinceAnalyze = true; // Initially true to enable analyze

        this._bindEvents();
    }

    _bindEvents() {
        const debouncedInputChange = Utilities.debounce(() => this._handleInputChange(), CONFIG.DEBOUNCE_DELAY);
        this.userPrompt.addEventListener('input', debouncedInputChange);
        this.aiResponse.addEventListener('input', debouncedInputChange);

        this.analyzeBtn.addEventListener('click', () => {
            if (!this.analyzeBtn.disabled && this.inputsChangedSinceAnalyze) {
                this.onAnalyze(this.getUserPrompt(), this.getAIResponse());
                this.inputsChangedSinceAnalyze = false;
                this.hideForwardButton(); // Hide forward on new analyze, show later manually if needed
                this._updateAnalyzeButton(); // disable analyze if inputs empty or no changes
            }
        });

        this.forwardBtn.addEventListener('click', () => {
            if (!this.forwardBtn.disabled) {
                this.onForward();
            }
        });
    }

    _handleInputChange() {
        this.inputsChangedSinceAnalyze = true;
        this.hideForwardButton();
        this._updateAnalyzeButton();
    }

    _updateAnalyzeButton() {
        const bothInputsFilled = this.userPrompt.value.trim() && this.aiResponse.value.trim();
        this.analyzeBtn.disabled = !(bothInputsFilled && this.inputsChangedSinceAnalyze);
    }

    show() {
        this.container.style.display = 'flex';
    }

    hide() {
        this.container.style.display = 'none';
    }

    showForwardButton() {
        this.forwardBtn.style.display = 'inline-block';
        this.forwardBtn.disabled = false;
    }

    hideForwardButton() {
        this.forwardBtn.style.display = 'none';
        this.forwardBtn.disabled = true;
    }

    setUserPrompt(text) {
        this.userPrompt.value = text;
        this._handleInputChange();
    }

    setAIResponse(text) {
        this.aiResponse.value = text;
        this._handleInputChange();
    }

    getUserPrompt() {
        return this.userPrompt.value.trim();
    }

    getAIResponse() {
        return this.aiResponse.value.trim();
    }
}
