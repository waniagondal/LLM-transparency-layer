/**
 * @module AnalyzingPage
 *
 * @description
 * This module exports the `AnalyzingPage` class, which represents the UI component
 * responsible for displaying a loading indicator while analysis is in progress.
 *
 * The component provides simple methods to show or hide the loading UI.
 */

import { Utilities } from "../../utils/utilities";

/**
 * Represents the analyzing page UI shown during prompt analysis.
 */
export class AnalyzingPage {
    /**
     * Creates an instance of AnalyzingPage.
     *
     * Initializes the container element with appropriate class and content.
     */
    constructor() {
        /**
         * The root container element for the analyzing page.
         * @type {HTMLElement}
         */
        this.container = Utilities.createElement('div', 'analyzing-page');

        // New modernized content
        this.container.innerHTML = `
      <div class="analyzing-content">
        <div class="spinner"></div>
        <p class="analyzing-text">Analyzing...</p>
      </div>
    `;
    }

    /**
     * Makes the analyzing page visible by setting its display style.
     */
    show() {
        this.container.style.display = 'flex';
    }

    /**
     * Hides the analyzing page by setting its display style to none.
     */
    hide() {
        this.container.style.display = 'none';
    }
}
