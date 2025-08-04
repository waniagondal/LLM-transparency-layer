/**
 * @module StateManager
 *
 * @description
 * Implements the application state management logic.
 * Manages state updates, subscriptions, and notifications
 * for UI components or other consumers.
 */

import { PANEL_MODES } from "../../infrastructure/config/constants";

/**
 * @typedef {Object} AppState
 * @property {string} userPrompt
 * @property {string} aiResponse
 * @property {string[]} assumptions
 * @property {string} savedPrompt
 * @property {string} savedResponse
 * @property {'edit' | 'assumptions' | 'analyzing'} currentMode
 * @property {boolean} isAnalyzing
 */

/**
 * StateManager handles the global application state, providing
 * methods to get, set, reset state, and subscribe to state changes.
 */
export class StateManager {
    /**
     * Internal state object.
     * @type {AppState}
     */
    state = {
        userPrompt: '',
        aiResponse: '',
        assumptions: [],
        savedPrompt: '',
        savedResponse: '',
        currentMode: PANEL_MODES.EDIT,
        isAnalyzing: false,
    };

    /**
     * Set of listeners to notify on state changes.
     * @type {Set<function(AppState, AppState): void>}
     */
    listeners = new Set();

    /**
     * Returns a read-only copy of the current application state.
     * @returns {Readonly<AppState>} Current state snapshot.
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Updates the application state with partial changes
     * and notifies all subscribed listeners.
     * @param {Partial<AppState>} updates - Partial state updates.
     */
    setState(updates) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...updates };
        this.notifyListeners(this.state, oldState);
    }

    /**
     * Subscribes a listener callback to state changes.
     * Returns an unsubscribe function to remove the listener.
     * @param {function(AppState, AppState): void} listener - Callback on state change.
     * @returns {function(): void} Unsubscribe function.
     */
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    /**
     * Resets the state to initial default values
     * and notifies listeners of the change.
     */
    reset() {
        this.setState({
            userPrompt: '',
            aiResponse: '',
            assumptions: [],
            savedPrompt: '',
            savedResponse: '',
            currentMode: PANEL_MODES.EDIT,
            isAnalyzing: false,
        });
    }

    /**
     * Notifies all subscribed listeners of a state change.
     * @param {AppState} newState - The updated state.
     * @param {AppState} oldState - The previous state.
     * @private
     */
    notifyListeners(newState, oldState) {
        this.listeners.forEach(listener => listener(newState, oldState));
    }
}
