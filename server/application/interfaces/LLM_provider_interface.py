"""
Interface definition for Large Language Model (LLM) providers.

Defines the contract for LLM provider implementations, specifying
methods that must be implemented to extract reasoning assumptions
from AI responses.
"""

from abc import ABC, abstractmethod
from typing import List

class LLMProviderInterface(ABC):
    """
    Abstract base class representing the interface for LLM providers.

    Any LLM provider implementation should inherit from this class and
    implement the defined abstract methods to ensure consistent behavior.
    """

    @abstractmethod
    def get_chain_of_assumptions(self, user_prompt: str, ai_response: str) -> List[str]:
        """
        Extract a list of reasoning assumptions from the AI's response.

        Args:
            user_prompt (str): The original input prompt from the user.
            ai_response (str): The AI-generated response to the prompt.

        Returns:
            List[str]: A list of inferred reasoning assumptions extracted
            from the AI's response.
        """
        pass
