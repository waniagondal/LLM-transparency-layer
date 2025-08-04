/**
 * @module: SelectionToolbar
 *
 * @description
 * Displays a floating toolbar when text is selected.
 * Allows the user to insert selected text into a user prompt or AI response field.
 */
import {Utilities} from "../../utils/utilities";
import {CONFIG} from "../../infrastructure/config/constants";

export class SelectionToolbar {
    /**
     * @param {PanelManager} panelManager - Object to manage user/AI input panel.
     */
    constructor(panelManager) {
        /** @private */
        this.panelManager = panelManager;

        /** @private @type {HTMLElement|null} */
        this.toolbarElement = null;

        /** @private @type {boolean} */
        this.isVisible = false;

        this._onSelectionChange = this._onSelectionChange.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onScroll = this.hide.bind(this);

        this._init();
    }

    /**
     * Initializes event listeners.
     * @private
     */
    _init() {
        document.addEventListener('selectionchange', this._onSelectionChange);
        window.addEventListener('scroll', this._onScroll);
        window.addEventListener('mousedown', this._onMouseDown);
    }

    /**
     * Handles selection changes in the document.
     * @private
     */
    _onSelectionChange() {
        if (!this.panelManager.isVisible()) {
            this.hide();
            return;
        }

        const selectedText = Utilities.getSelection();
        const selection = window.getSelection();

        if (
            !selectedText ||
            !selection?.anchorNode ||
            this.panelManager.panel?.contains(selection.anchorNode)
        ) {
            this.hide();
            return;
        }

        this.show();
    }

    /**
     * Handles clicks outside the toolbar.
     * @param {MouseEvent} event
     * @private
     */
    _onMouseDown(event) {
        if (this.toolbarElement && !this.toolbarElement.contains(event.target)) {
            this.hide();
        }
    }

    /**
     * Creates the toolbar element if it doesn't already exist.
     * @private
     * @returns {HTMLElement}
     */
    _createToolbar() {
        if (this.toolbarElement) return this.toolbarElement;

        this.toolbarElement = Utilities.createElement(
            'div',
            '',
            `
        <button id="insert-user-prompt">User Prompt</button>
        <button id="insert-ai-response">AI Response</button>
      `
        );

        this.toolbarElement.id = CONFIG.TOOLBAR_ID;

        const userBtn = this.toolbarElement.querySelector('#insert-user-prompt');
        const aiBtn = this.toolbarElement.querySelector('#insert-ai-response');

        userBtn?.addEventListener('click', () => this._insertSelection('user'));
        aiBtn?.addEventListener('click', () => this._insertSelection('ai'));

        document.body.appendChild(this.toolbarElement);
        return this.toolbarElement;
    }

    /**
     * Inserts the selected text into the user or AI prompt.
     * @param {'user' | 'ai'} type
     * @private
     */
    _insertSelection(type) {
        const selectedText = Utilities.getSelection();
        if (!selectedText) return;

        this.panelManager.show();

        if (type === 'user') {
            this.panelManager.setUserPrompt(selectedText);
        } else {
            this.panelManager.setAIResponse(selectedText);
        }

        this.panelManager.enterEditMode();
        this.hide();
    }

    /**
     * Shows the toolbar above the selected text.
     */
    show() {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const toolbar = this._createToolbar();
        const toolbarWidth = 200;

        const left = window.scrollX + rect.left + rect.width / 2 - toolbarWidth / 2;
        const top = window.scrollY + rect.top - 50;

        toolbar.style.left = `${Math.max(left, 10)}px`;
        toolbar.style.top = `${Math.max(top, 10)}px`;
        toolbar.classList.add('visible');
        this.isVisible = true;
    }

    /**
     * Hides the toolbar.
     */
    hide() {
        if (this.toolbarElement) {
            this.toolbarElement.classList.remove('visible');
            this.isVisible = false;
        }
    }

    /**
     * Cleans up the toolbar and event listeners.
     */
    destroy() {
        if (this.toolbarElement) {
            this.toolbarElement.remove();
            this.toolbarElement = null;
        }

        document.removeEventListener('selectionchange', this._onSelectionChange);
        window.removeEventListener('scroll', this._onScroll);
        window.removeEventListener('mousedown', this._onMouseDown);
    }
}
