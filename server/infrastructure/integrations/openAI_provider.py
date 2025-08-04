"""
openai_provider.py

Integration for OpenAI API to extract chain-of-thought assumptions
from AI responses. Provides prompt construction, API calls,
and JSON parsing of the results.
"""

import json
from openai import OpenAI
from server.application.interfaces.LLM_provider_interface import LLMProviderInterface

class OpenAIProvider(LLMProviderInterface):
    """
    Client for interacting with OpenAI to analyze AI responses.

    Args:
        api_key (str): OpenAI API key for authentication.
        model (str): OpenAI model identifier to use (default: "gpt-4.1-mini").
    """
    def __init__(self, api_key: str, model: str = "gpt-4.1-mini"):
        if not api_key:
            raise ValueError("API key must be provided to OpenAIProvider.")
        self.client = OpenAI(api_key=api_key)
        self.model = model

    @staticmethod
    def build_prompt(user_prompt: str, ai_response: str) -> str:
        """
        Creates a prompt for the LLM to extract reasoning assumptions.

        Args:
            user_prompt (str): Original prompt from the user.
            ai_response (str): AI-generated response to analyze.

        Returns:
            str: Formatted prompt instructing the LLM to output assumptions in JSON.
        """
        return (
            "You are an expert reasoning analyst AI focused on improving LLM interpretability. "
            "Given a user prompt and an AI's response, reconstruct the most probable internal chain-of-thought behind the AI’s reply. "
            "Analyze how the AI interpreted the user’s intent, background knowledge, and expectations. "
            "Explain its choice of explanation style, examples, and level of detail.\n\n"
            "User prompt:\n"
            f"{user_prompt}\n\n"
            "AI response:\n"
            f"{ai_response}\n\n"
            "Return ONLY a JSON object with the key:\n"
            "\"assumptions\": a detailed list of all explicit and implicit assumptions the AI made "
            "about the user’s background, intent, or expectations. Do NOT include any extra explanation or divide into categories. "
            "Start each assumption with 'The user'"
        )

    def call_llm(self, prompt: str) -> str:
        """
        Sends the prompt to the OpenAI API and returns the raw response text.

        Args:
            prompt (str): The prompt to send to the OpenAI API.

        Returns:
            str: Raw text output from the LLM.

        Raises:
            RuntimeError: If the OpenAI API call fails.
        """
        try:
            response = self.client.responses.create(
                model=self.model,
                input=prompt
            )
            return response.output[0].content[0].text
        except Exception as e:
            raise RuntimeError(f"OpenAI API call failed: {str(e)}") from e

    @staticmethod
    def parse_assumptions(output_text: str) -> list[str]:
        """
        Parses the JSON output from the LLM to extract assumptions.

        Args:
            output_text (str): Raw output text from the LLM.

        Returns:
            list[str]: List of assumptions, or empty list if parsing fails.
        """
        cleaned_text = output_text.strip().removeprefix("```json").removesuffix("```").strip()
        try:
            return json.loads(cleaned_text).get("assumptions", [])
        except json.JSONDecodeError:
            return []

    def get_chain_of_assumptions(self, user_prompt: str, ai_response: str) -> list[str]:
        """
        Main method: builds prompt, calls LLM, and parses assumptions.

        Args:
            user_prompt (str): User's input prompt.
            ai_response (str): AI's response to analyze.

        Returns:
            list[str]: Extracted list of assumptions from the AI response.
        """
        prompt = self.build_prompt(user_prompt, ai_response)
        output_text = self.call_llm(prompt)
        return self.parse_assumptions(output_text)
