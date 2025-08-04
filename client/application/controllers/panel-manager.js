/**
 * @module PanelManager
 *
 * @description
 * This module exports the `PanelManager` class, which manages the lifecycle and UI state
 * of a multi-panel side interface designed for analyzing user prompts with AI reasoning.
 *
 * The panel consists of three main views/pages:
 * - InputPage: Where users enter prompts and AI responses.
 * - AnalyzingPage: Displays a loading/processing state during analysis.
 * - AssumptionsPage: Shows extracted assumptions with editing capabilities.
 *
 * The manager handles switching between modes, updates state, coordinates API calls,
 * and integrates with LLM frontends for prompt insertion.
 */

import {StylesManager} from "../../presentation/styles/styles-manager";
import {CONFIG, PANEL_MODES} from "../../infrastructure/config/constants";
import {InputPage} from "../../presentation/pages/input-page";
import {AnalyzingPage} from "../../presentation/pages/analyzing-page";
import {AssumptionsPage} from "../../presentation/pages/assumptions-page";

/**
 * class representing the main panel interface controller.
 *
 * Manages the UI panels, state updates, API interactions, and event handlers.
 */
export class PanelManager {
    /**
     * Creates an instance of PanelManager, class representing the main panel interface controller.
     * Manages the UI panels, state updates, API interactions, and event handlers.
     *
     */
    constructor({ stateManager, apiClient, llmFrontend }) {
        if (!stateManager || !apiClient || !llmFrontend) {
            throw new Error('PanelManager requires stateManager, apiClient, and llmFrontend instances');
        }

        // Inject necessary CSS styles once at initialization
        StylesManager.inject();

        this.stateManager = stateManager;
        this.apiClient = apiClient;
        this.llmFrontend = llmFrontend;

        /**
         * The root container element for the panel.
         * @type {HTMLElement}
         */
        this.panel = document.createElement('aside');
        this.panel.id = CONFIG.PANEL_ID;

        this._createHeader();

        // Initialize pages and wire callbacks
        this.inputPage = new InputPage(
            this._handleAnalyze.bind(this),
            this._handleForward.bind(this)  // <-- Added Forward button callback here
        );
        this.analyzingPage = new AnalyzingPage();
        this.assumptionsPage = new AssumptionsPage(
            this.enterEditMode.bind(this),
            this._handleReprompt.bind(this),
            this._handleUpdateAssumptions.bind(this),
        );

        // Append all pages to the panel container
        this.panel.append(
            this.inputPage.container,
            this.analyzingPage.container,
            this.assumptionsPage.container
        );

        // Append panel to the document body
        document.body.appendChild(this.panel);

        /** @private @type {string} */
        this.currentMode = PANEL_MODES.EDIT;
        this._updateModeUI(this.currentMode);

        // Subscribe to state changes to update UI accordingly
        this.stateManager.subscribe(this._handleStateChange.bind(this));
    }

    /**
     * Creates and appends the panel header including title and close button.
     * @private
     */
    _createHeader() {
        const header = document.createElement('header');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '12px';

        const title = document.createElement('h2');
        title.textContent = 'Analyze Prompt';
        this.titleElement = title;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => this.hide();

        header.append(title, closeBtn);
        this.panel.appendChild(header);
    }

    /**
     * Handles application state changes to update UI accordingly.
     *
     * @param {Object} newState - The updated application state.
     * @param {Object} oldState - The previous application state.
     * @private
     */
    _handleStateChange(newState, oldState) {
        if (newState.currentMode !== oldState.currentMode) {
            this.currentMode = newState.currentMode;
            this._updateModeUI(this.currentMode);
        }

        // Use shallow compare for assumptions to avoid unnecessary updates
        const assumptionsChanged = !this._arraysEqual(newState.assumptions, oldState.assumptions);
        if (assumptionsChanged) {
            this.assumptionsPage.setAssumptions(newState.assumptions || []);
        }
    }

    /**
     * Helper method to shallow compare two arrays for equality.
     *
     * @param {Array} arr1
     * @param {Array} arr2
     * @returns {boolean}
     * @private
     */
    _arraysEqual(arr1 = [], arr2 = []) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    /**
     * Updates the panel UI according to the current mode.
     *
     * Shows or hides the Forward button based on assumptions presence in Edit mode.
     *
     * @param {string} mode - One of the PANEL_MODES values.
     * @private
     */
    _updateModeUI(mode) {
        const state = this.stateManager.getState();

        switch (mode) {
            case PANEL_MODES.EDIT:
                this.titleElement.textContent = 'Analyze Prompt';
                this.inputPage.show();
                this.analyzingPage.hide();
                this.assumptionsPage.hide();

                // Show Forward button only if assumptions exist
                if (state.assumptions && state.assumptions.length > 0) {
                    this.inputPage.showForwardButton();
                } else {
                    this.inputPage.hideForwardButton();
                }
                break;

            case PANEL_MODES.ANALYZING:
                this.titleElement.textContent = 'Analyzing...';
                this.inputPage.hide();
                this.analyzingPage.show();
                this.assumptionsPage.hide();
                this.inputPage.hideForwardButton();
                break;

            case PANEL_MODES.ASSUMPTIONS:
                this.titleElement.textContent = 'Assumptions';
                this.inputPage.hide();
                this.analyzingPage.hide();
                this.assumptionsPage.show();
                this.inputPage.hideForwardButton();
                break;

            default:
                this.inputPage.show();
                this.analyzingPage.hide();
                this.assumptionsPage.hide();
                this.inputPage.hideForwardButton();
        }
    }

    /**
     * Performs analysis on the given prompt and AI response.
     *
     * Sets the panel to analyzing mode and calls the API to extract assumptions.
     * Updates the state and UI based on the result.
     *
     * @param {string} userPrompt - The prompt text from the user.
     * @param {string} aiResponse - The AI's response text.
     * @returns {Promise<void>}
     * @private
     */
    async _handleAnalyze(userPrompt, aiResponse) {
        this.stateManager.setState({
            isAnalyzing: true,
            savedPrompt: userPrompt,
            savedResponse: aiResponse,
            currentMode: PANEL_MODES.ANALYZING,
        });

        try {
            const result = await this.apiClient.extractReasoning(userPrompt, aiResponse);

            if (result.success) {
                this.stateManager.setState({
                    assumptions: result.data.assumptions ?? [],
                    isAnalyzing: false,
                    currentMode: PANEL_MODES.ASSUMPTIONS,
                });
                this.assumptionsPage.setAssumptions(result.data.assumptions ?? []);
            } else {
                console.error('Analysis error:', result.error);
                this.stateManager.setState({
                    isAnalyzing: false,
                    currentMode: PANEL_MODES.EDIT,
                });
            }
        } catch (error) {
            console.error('API call failed:', error);
            this.stateManager.setState({
                isAnalyzing: false,
                currentMode: PANEL_MODES.EDIT,
            });
        }
    }

    /**
     * Handles Forward button click.
     * Switches panel from Edit mode to Assumptions mode if assumptions exist.
     * @private
     */
    _handleForward() {
        const state = this.stateManager.getState();
        if (state.assumptions && state.assumptions.length > 0) {
            this.stateManager.setState({ currentMode: PANEL_MODES.ASSUMPTIONS });
        }
    }

    /**
     * Inserts a reprompt into the LLM frontend input, incorporating assumptions.
     *
     * @private
     */
    _handleReprompt() {
        const state = this.stateManager.getState();
        const cleanedPrompt = (state.savedPrompt || '').trim().replace(/[.?!]*$/, '');

        const text = `Please answer the following: ${cleanedPrompt}. When answering, make ONLY the following assumptions about the user's request:\n${(state.assumptions || [])
            .map(a => '- ' + a)
            .join('\n')}`;

        try {
            this.llmFrontend.insertPrompt(text);
        } catch (error) {
            console.error('Failed to insert prompt into LLM input:', error);
        }
    }

    /**
     * Updates the state with new assumptions.
     *
     * @param {string[]} updatedAssumptions - The updated list of assumptions.
     * @private
     */
    _handleUpdateAssumptions(updatedAssumptions) {
        this.stateManager.setState({ assumptions: updatedAssumptions });
    }

    /**
     * Sets the user prompt text in the InputPage.
     *
     * @param {string} text - The prompt text to set.
     */
    setUserPrompt(text) {
        this.inputPage.setUserPrompt(text);
    }

    /**
     * Sets the AI response text in the InputPage.
     *
     * @param {string} text - The AI response text to set.
     */
    setAIResponse(text) {
        this.inputPage.setAIResponse(text);
    }

    /**
     * Returns true if the panel is currently visible.
     * @returns {boolean}
     */
    isVisible() {
        return this.panel.classList.contains('visible');
    }

    /**
     * Shows the panel by adding the visible class.
     */
    show() {
        this.panel.classList.add('visible');
        console.log('[PanelManager] show() called');
    }

    /**
     * Hides the panel by removing the visible class.
     */
    hide() {
        this.panel.classList.remove('visible');
    }

    /**
     * Switches the panel back to Edit mode.
     */
    enterEditMode() {
        this.stateManager.setState({ currentMode: PANEL_MODES.EDIT });
    }
}
