# GlassOS: LLM Transparency Layer

This project provides a FastAPI backend and a Chrome extension frontend to analyze large language model (LLM) responses by extracting the chain of assumptions the AI makes when generating text. This helps users understand the implicit reasoning behind LLM outputs.

## Features

- FastAPI backend API for analyzing LLM responses  
- Chrome extension frontend for easy interaction  
- Environment configuration with `.env` file for API keys and settings  
- Modular provider interface supporting OpenAI (expandable)  
- CORS middleware configured for frontend integration  

## Getting Started

### Prerequisites

- Python 3.10+  
- Node.js and npm (for frontend development, if needed)  
- Google Chrome browser  

### Frontend Setup

1. Navigate to the client folder:

   ```bash
   cd client

2. Install frontend dependencies:

   ```bash
   npm install

3. Build the frontend while in client (to create content.js folder)

   ```bash
   npm run build
   
### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/waniagondal/LLM-transparency-layer.git
   
   ```bash
   cd LLM-transparency-layer

2. Create and activate a Python virtual environment (recommended):

   ```bash
   python3 -m venv venv
   
   ```bash
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   
3. Install backend dependencies:

   ```bash
   pip install -r requirements.txt

4. Create a .env file in the root directory with your OpenAI API key:

   ```bash
   OPENAI_API_KEY=your_openai_api_key_here

## Running The Project

### Frontend
1. Open Google Chrome
2. Go to chrome://extensions/
3. Enable Developer mode (toggle top-right)
4. Click Load unpacked
5. Select the client folder inside the project directory

### Backend
Run the FastAPI backend using Uvicorn:

   ```bash
   uvicorn server.main:app --reload
