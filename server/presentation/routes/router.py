"""
Assumptions extraction API router.

Defines a single endpoint to extract the chain of assumptions from
a user prompt and an LLM response. Currently, supports only the OpenAI provider.
"""

from fastapi import APIRouter, Request, Query, HTTPException
from server.application.services.assumptions_service import extract_chain_of_assumptions
from server.domain.models.conversation_schemas import LLMReasoningAssumptions, UserPromptAndResponse

LLM_assumptions_router = APIRouter(
    prefix="/assumptions"
)

@LLM_assumptions_router.post("/extract-assumptions", response_model=LLMReasoningAssumptions)
def extract_assumptions_route(
        request: Request,
        data: UserPromptAndResponse,
) -> LLMReasoningAssumptions:
    """
    Extract assumptions from a prompt and response pair.

    Args:
        request (Request): FastAPI request object, used to access application state.
        data: Contains user prompt, LLM response, and LLM provider.

    Returns:
        Structured list of assumptions inferred from the LLM's reasoning.
    """
    provider = data.provider
    providers = request.app.state.providers
    llm_provider = providers.get(provider)

    if llm_provider is None:
        raise HTTPException(status_code=400, detail=f"Unknown provider: {provider}")

    steps = extract_chain_of_assumptions(data.prompt, data.response, llm_provider)
    return LLMReasoningAssumptions(assumptions=steps)
