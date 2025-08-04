"""
Domain models for conversation schemas.

Defines input and output data structures for handling
user prompts, AI responses, and extracted AI reasoning assumptions.
"""

from pydantic import BaseModel, Field
from typing import List

class UserPromptAndResponse(BaseModel):
    """
    Input schema containing the user's prompt and the AI's response.
    """
    prompt: str = Field(..., description="Original user input prompt.")
    response: str = Field(..., description="AI-generated response to the prompt.")
    provider: str = "openai"  # default provider


class LLMReasoningAssumptions(BaseModel):
    """
    Output schema representing extracted assumptions from the AI's reasoning.
    """
    assumptions: List[str] = Field(..., description="List of inferred AI reasoning assumptions.")
