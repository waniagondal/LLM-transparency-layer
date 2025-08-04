/**
 * @module AssumptionsPage
 *
 * @description
 * This module exports the `AssumptionsPage` class, a UI component for displaying,
 * editing, and managing assumptions extracted during analysis.
 *
 * The component allows users to edit or delete assumptions, navigate back,
 * or trigger a reprompt to the LLM based on current assumptions.
 */

import { Utilities } from "../../utils/utilities";

/**
 * Represents the assumptions page UI for displaying and editing assumptions.
 */
export class AssumptionsPage {
    /**
     * Creates an instance of AssumptionsPage.
     *
     * @param {() => void} onBack - Callback invoked when the user clicks the Back button.
     * @param {() => void} onReprompt - Callback invoked when the user clicks the Reprompt button.
     * @param {(updatedAssumptions: string[]) => void} onUpdateAssumptions - Callback invoked whenever the assumptions list is updated.
     */
    constructor(onBack, onReprompt, onUpdateAssumptions) {
        this.onBack = onBack;
        this.onReprompt = onReprompt;
        this.onUpdateAssumptions = onUpdateAssumptions;

        this.container = Utilities.createElement('div', 'assumptions-page');
        this.assumptionsContainer = Utilities.createElement('div', 'assumptions-container');
        this.buttonsContainer = Utilities.createElement('div', 'buttons-container');

        this.backBtn = Utilities.createElement('button', 'panel-button secondary', '← Back');
        this.repromptBtn = Utilities.createElement('button', 'panel-button', 'Reprompt your LLM');

        this.buttonsContainer.append(this.backBtn, this.repromptBtn);
        this.container.append(this.assumptionsContainer, this.buttonsContainer);

        this.backBtn.onclick = () => this.onBack();
        this.repromptBtn.onclick = () => this.onReprompt();

        this.assumptions = [];
    }

    /**
     * Sets the assumptions to display and edit.
     * @param {string[]} assumptions - Array of assumption strings.
     */
    setAssumptions(assumptions) {
        this.assumptions = assumptions.slice();
        this._renderAssumptions();
    }

    /**
     * Renders the assumptions in the UI, showing editable bubbles or error if none exist.
     * @private
     */
    _renderAssumptions() {
        this.assumptionsContainer.innerHTML = '';

        if (this.assumptions.length === 0) {
            this.assumptionsContainer.innerHTML = '<div class="error">No assumptions found</div>';
            return;
        }

        this.assumptions.forEach((text, i) => {
            const bubble = this._createAssumptionBubble(text, i);
            this.assumptionsContainer.appendChild(bubble);
        });
    }

    /**
     * Creates an individual assumption bubble with editable text and buttons.
     * @param {string} text - The assumption text.
     * @param {number} index - Index of the assumption in the array.
     * @returns {HTMLElement} The assumption bubble element.
     * @private
     */
    _createAssumptionBubble(text, index) {
        const div = Utilities.createElement('div', 'assumption-bubble');

        const span = Utilities.createElement('span');
        span.textContent = text;

        const input = Utilities.createElement('input', 'assumption-edit-input');
        input.value = text;
        input.style.display = 'none';

        const editBtn = Utilities.createElement('button', 'assumption-button', '✎');
        const delBtn = Utilities.createElement('button', 'assumption-button', '×');

        editBtn.onclick = () => {
            span.style.display = 'none';
            input.style.display = 'inline-block';
            input.focus();
            input.select();
        };

        delBtn.onclick = () => {
            this.assumptions.splice(index, 1);
            this._updateAssumptionsState();
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.assumptions[index] = input.value.trim();
                this._updateAssumptionsState();
            } else if (e.key === 'Escape') {
                input.value = this.assumptions[index];
                span.style.display = 'inline-block';
                input.style.display = 'none';
            }
        });

        input.addEventListener('blur', () => {
            span.style.display = 'inline-block';
            input.style.display = 'none';
        });

        div.append(span, input, editBtn, delBtn);

        return div;
    }

    /**
     * Updates the assumptions state internally and calls the onUpdateAssumptions callback.
     * @private
     */
    _updateAssumptionsState() {
        this._renderAssumptions();
        this.onUpdateAssumptions(this.assumptions);
    }

    show() {
        this.container.style.display = 'flex';
    }

    hide() {
        this.container.style.display = 'none';
    }
}