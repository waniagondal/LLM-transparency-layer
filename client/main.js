/**
 * @fileoverview
 * Initializes the GlassOSApp once the DOM and supported LLM frontend UI are ready.
 * Ensures singleton app instance and proper cleanup before restarting.
 */
import {getActiveLLMFrontendAdapter} from "./infrastructure/llm-frontend-adapter/llm-frontend-adapters";
import {GlassOSApp} from "./app/glass-OS-app";

let appInstance = null;
let initialized = false;

/**
 * Waits until a supported LLM frontend adapter is detected on the page,
 * retrying periodically until timeout.
 * @param {number} [timeout=10000] Timeout in milliseconds to wait before giving up.
 * @param {number} [interval=500] Interval in milliseconds between detection attempts.
 * @returns {Promise<boolean>} Resolves to true if frontend detected, false if timed out.
 */
function waitForFrontendReady(timeout = 10000, interval = 500) {
    return new Promise((resolve) => {
        const start = Date.now();

        function check() {
            const frontendAdapter = getActiveLLMFrontendAdapter();

            if (frontendAdapter) {
                console.log(`[Initializer] Detected frontend: ${frontendAdapter.name}`);
                resolve(true);
            } else if (Date.now() - start > timeout) {
                resolve(false);
            } else {
                setTimeout(check, interval);
            }
        }

        check();
    });
}

/**
 * Initializes the GlassOSApp if a supported LLM frontend is detected.
 * Cleans up any existing app instance before starting a new one.
 * @returns {Promise<void>}
 */
async function initializeApp() {
    if (initialized) return;

    try {
        const ready = await waitForFrontendReady();
        if (!ready) {
            console.warn('[Initializer] No supported LLM frontend detected. Extension not initialized.');
            return;
        }
        if (appInstance) {
            appInstance.stop();
        }
        appInstance = new GlassOSApp();
        appInstance.start();
        initialized = true;
        console.log('[GlassOSApp] Initialized.');
    } catch (err) {
        console.error('[GlassOSApp] Initialization failed:', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
