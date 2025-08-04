/**
 * @module GlassOSApp
 *
 * @description
 * Main application class coordinating the prompt analysis extension.
 * Initializes and manages state, API client, UI panel, buttons,
 * and toolbar components based on detected LLM frontend adapter.
 *
 * Supports injecting the LLM provider to be used by the API client.
 */
import {StylesManager} from "../presentation/styles/styles-manager";
import {SelectionToolbar} from "../presentation/components/selection-toolbar";
import {OpenAIButtonComponent} from "../presentation/components/button_components/openai-button-component";
import {PanelManager} from "../application/controllers/panel-manager";
import {StateManager} from "../application/state/state-manager";
import {AssumptionsAPIClient} from "../infrastructure/services/assumptions-api-client";
import {getActiveLLMFrontendAdapter} from "../infrastructure/llm-frontend-adapter/llm-frontend-adapters";
import {detectProvider} from "../utils/utilities";

export class GlassOSApp {
    /**
     * Manages application state.
     * @type {StateManager}
     */
    stateManager;

    /**
     * Handles communication with backend API.
     * @type { AssumptionsAPIClient}
     */
    apiClient;

    /**
     * Adapter for the detected LLM frontend.
     * @type {import('./llm-frontend-adapter-interface').LLMFrontendAdapterInterface | null}
     */
    frontendAdapter;

    /**
     * Manages the UI panel for assumptions and results.
     * @type {PanelManager}
     */
    panelManager;

    /**
     * Manages extension buttons in the UI.
     * @type {OpenAIButtonComponent}
     */
    buttonManager;

    /**
     * Manages the selection toolbar UI.
     * @type {SelectionToolbar}
     */
    selectionToolbar;

    /**
     * Creates an instance of PromptAnalyzerApp.
     */
    constructor() {
        this.stateManager = new StateManager();

        this.frontendAdapter = getActiveLLMFrontendAdapter()

        if (!this.frontendAdapter) {
            console.warn('No supported LLM frontend detected. Extension not initialized.');
            return;
        }

        // Get provider from the adapter
        const provider = detectProvider(this.frontendAdapter);

        // Pass provider to ApiClient to include in API requests
        this.apiClient = new AssumptionsAPIClient(provider);


        if (!this.frontendAdapter) {
            console.warn('No supported LLM frontend detected. Extension not initialized.');
            return;
        }

        this.panelManager = new PanelManager({
            stateManager: this.stateManager,
            apiClient: this.apiClient,
            llmFrontend: this.frontendAdapter,
        });
        this.buttonManager = new OpenAIButtonComponent(this.panelManager, this.frontendAdapter);
        this.selectionToolbar = new SelectionToolbar(this.panelManager);
    }

    /**
     * Starts the extension: injects styles and initializes buttons.
     */
    start() {
        StylesManager.inject();
        this.buttonManager.init();
    }

    /**
     * Stops the extension: destroys buttons, panels, and toolbars.
     */
    stop() {
        this.buttonManager.destroy();
        this.panelManager.destroy();
        this.selectionToolbar.destroy();
    }
}
