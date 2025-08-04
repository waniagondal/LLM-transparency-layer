import { CONFIG } from '../../infrastructure/config/constants';

export class StylesManager {
    static inject() {
        if (document.getElementById(CONFIG.STYLES_ID)) return;

        const style = document.createElement('style');
        style.id = CONFIG.STYLES_ID;
        style.textContent = this.getStyles();
        document.head.appendChild(style);
    }

    static getStyles() {
        return `
          .custom-wrapper {
            display: inline-flex;
            height: 36px;
            border-radius: 9999px;
            border: 1px solid var(--border-default);
            font-size: 13px;
            font-weight: var(--font-weight-semibold);
            color: var(--text-secondary);
            background-color: transparent;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.15s ease-in-out;
          }
          
          .custom-wrapper:hover {
            background-color: var(--interactive-bg-secondary-hover);
          }

          .custom-wrapper > button {
            all: unset;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-width: 32px;
            padding: 0 8px;
            gap: 6px;
            font: inherit;
            color: inherit;
            border-radius: 9999px;
            cursor: pointer;
          }

          .custom-wrapper > button img.icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            object-fit: cover;
          }

          #${CONFIG.PANEL_ID} {
            position: fixed;
            top: 80px;
            right: 20px;
            width: ${CONFIG.PANEL_WIDTH}px;
            max-height: ${CONFIG.MAX_PANEL_HEIGHT}px;
            background: #121212;
            color: #eee;
            font-family: Arial, sans-serif;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.7);
            display: none;
            flex-direction: column;
            z-index: 99999;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity ${CONFIG.ANIMATION_DURATION}ms ease, transform ${CONFIG.ANIMATION_DURATION}ms ease;
          }

          #${CONFIG.PANEL_ID}.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0);
          }

          #${CONFIG.PANEL_ID} header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            border-bottom: 1px solid #222;
          }

          #${CONFIG.PANEL_ID} header h2 {
            margin: 0;
            font-weight: 700;
            font-size: 18px;
            flex-grow: 1;
          }

          #${CONFIG.PANEL_ID} header .close-btn {
            cursor: pointer;
            background: transparent;
            border: none;
            color: #aaa;
            font-size: 22px;
            font-weight: 700;
            line-height: 1;
            transition: color 0.2s ease;
          }

          #${CONFIG.PANEL_ID} header .close-btn:hover {
            color: #fff;
          }

          .bubble-input {
            background: #222;
            border-radius: 24px;
            padding: 10px 16px;
            margin: 12px 16px;
            color: #eee;
            font-size: 14px;
            border: none;
            outline: none;
            min-height: 40px;
            transition: opacity ${CONFIG.ANIMATION_DURATION}ms ease, transform ${CONFIG.ANIMATION_DURATION}ms ease;
            resize: vertical;
          }

          .bubble-input:focus {
            background: #2a2a2a;
            box-shadow: 0 0 0 2px #2563eb;
          }

          .panel-button {
            margin: 8px 4px 16px;
            background-color: #2563eb;
            color: white;
            font-weight: bold;
            border: none;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease, opacity 0.2s ease;
          }

          .panel-button:hover:not(:disabled) {
            background-color: #1d4ed8;
          }

          .panel-button:disabled {
            background-color: #374151;
            cursor: not-allowed;
            opacity: 0.6;
          }

          .panel-button.secondary {
            background-color: #374151;
          }

          .panel-button.secondary:hover {
            background-color: #4b5563;
          }

          .assumptions-container {
            margin: 12px 16px;
            flex-grow: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 360px;
            transition: opacity ${CONFIG.ANIMATION_DURATION}ms ease, transform ${CONFIG.ANIMATION_DURATION}ms ease;
          }

          .assumption-bubble {
            background: #333;
            border-radius: 24px;
            padding: 8px 14px;
            color: #ddd;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            transition: background-color 0.2s ease;
          }

          .assumption-bubble:hover {
            background: #3a3a3a;
          }

          .assumption-edit-input {
            flex-grow: 1;
            background: #222;
            border: none;
            color: #eee;
            border-radius: 12px;
            padding: 6px 10px;
            font-size: 14px;
          }

          .assumption-button {
            background: transparent;
            border: none;
            color: #aaa;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: color 0.2s ease, background-color 0.2s ease;
          }

          .assumption-button:hover {
            color: #fff;
            background-color: #555;
          }

          .hidden {
            opacity: 0;
            pointer-events: none;
            transform: translateY(-10px);
          }

          #${CONFIG.TOOLBAR_ID} {
            position: absolute;
            background: #2563eb;
            color: white;
            border-radius: 8px;
            padding: 6px 10px;
            font-size: 14px;
            display: flex;
            gap: 8px;
            z-index: 9999999;
            user-select: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
          }

          #${CONFIG.TOOLBAR_ID}.visible {
            opacity: 1;
            pointer-events: auto;
          }

          #${CONFIG.TOOLBAR_ID} button {
            background: transparent;
            border: 1px solid white;
            color: white;
            border-radius: 6px;
            padding: 4px 8px;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          #${CONFIG.TOOLBAR_ID} button:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 20px;
            color: #aaa;
          }

          .error {
            color: #f87171;
            text-align: center;
            padding: 16px;
            font-style: italic;
          }
          
          .analyzing-page {
             display: none;
             align-items: center;
             justify-content: center;
             flex: 1;
             padding: 40px 20px;
             backdrop-filter: blur(10px);
             background: rgba(18, 18, 18, 0.6);
             border-radius: 12px;
          }
            
           .analyzing-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
              text-align: center;
            }
            
            .analyzing-text {
              font-size: 18px;
              font-weight: 500;
              color: #ccc;
              letter-spacing: 0.5px;
            }
            
            /* Animated spinner */
            .spinner {
              width: 40px;
              height: 40px;
              border: 4px solid rgba(255, 255, 255, 0.2);
              border-top-color: #2563eb;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
            }
            
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
        `;
    }
}