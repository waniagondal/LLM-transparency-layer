/**
 * @file constants.js
 * @description Global configuration and DOM selector constants for the extension UI.
 * Provides configuration for panel sizing, animation durations, element IDs, and supported modes.
 */

/**
 * Configuration constants used throughout the UI (e.g., panel dimensions, IDs, API URL).
 * @readonly
 * @type {Object}
 */
export const CONFIG = {
    /** ID for the floating button injected into the UI */
    BUTTON_ID: 'my-custom-button',

    /** Selector to find the composer footer container (for inserting UI) */
    FOOTER_SELECTOR: '[data-testid="composer-footer-actions"]',

    /** ID for the main side panel container */
    PANEL_ID: 'custom-side-panel',

    /** ID for the floating toolbar near selected text */
    TOOLBAR_ID: 'selection-toolbar',

    /** ID for dynamically injected styles */
    STYLES_ID: 'custom-button-styles',

    /** Backend API endpoint for extracting assumptions */
    API_ENDPOINT: 'http://localhost:8000/assumptions/extract-assumptions',

    /** Milliseconds for UI transitions/animations */
    ANIMATION_DURATION: 300,

    /** Delay used in debouncing user input */
    DEBOUNCE_DELAY: 250,

    /** Max allowed panel height in pixels */
    MAX_PANEL_HEIGHT: 540,

    /** Panel width in pixels */
    PANEL_WIDTH: 360,
};

/**
 * DOM selectors used throughout the UI components.
 * @readonly
 * @type {Object}
 */
export const SELECTORS = {
    USER_PROMPT: '#user-prompt',
    AI_RESPONSE: '#ai-response',
    ASSUMPTIONS_CONTAINER: '#assumptions-container',
    ANALYZE_BTN: '#analyze-btn',
    REPROMPT_BTN: '#reprompt-btn',
    BACK_BTN: '#back-btn',
    FORWARD_BTN: '#forward-btn',
    PANEL_TITLE: 'header h2',
    CLOSE_BTN: '.close-btn',
};

/**
 * Available panel modes.
 * Used to control which UI subpage is visible (edit, analyzing, or assumptions).
 * @readonly
 * @type {{ EDIT: 'edit', ASSUMPTIONS: 'assumptions', ANALYZING: 'analyzing' }}
 */
export const PANEL_MODES = {
    EDIT: 'edit',
    ASSUMPTIONS: 'assumptions',
    ANALYZING: 'analyzing',
};

/**
 * @typedef {'edit' | 'assumptions' | 'analyzing'} PanelMode
 * Represents one of the valid panel modes.
 */
