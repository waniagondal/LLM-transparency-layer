"""
Core business logic for extracting reasoning assumptions from user prompts and AI responses.
"""

from server.application.interfaces.LLM_provider_interface import LLMProviderInterface


def extract_chain_of_assumptions(prompt: str, response: str, llm_provider: LLMProviderInterface) -> list[str]:
    """
    Extracts the AI's inferred chain of reasoning assumptions given a prompt and response.

    This function obtains the appropriate LLM client via the provider factory,
    delegates the extraction process to it, and returns the assumptions as a list.

    Args:
        prompt: The original user prompt.
        response: The AI-generated response to the prompt.
        llm_provider: The LLM provider to use (default is 'openai').

    Returns:
        A list of strings representing the inferred assumptions from the AI's reasoning.

    Raises:
        Propagates exceptions from the underlying LLM client for caller handling.
    """
    assumptions = llm_provider.get_chain_of_assumptions(prompt, response)
    return assumptions
