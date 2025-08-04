"""
Main application entry point for GlassOS.

GlassOS exposes endpoints that accept user prompts and the AI-response to that prompt,
then analyzes these interactions to reverse-engineer underlying
assumptions. The goal is to help users better understand and steer the behavior
of large language models by uncovering implicit assumptions made during generation.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from server.infrastructure.config.settings import settings, Settings
from server.infrastructure.integrations.provider_factory import get_provider_instance
from server.infrastructure.middleware.cors import add_cors_middleware
from server.presentation.routes.router import LLM_assumptions_router


def setup_middleware(application: FastAPI, config: Settings) -> None:
    """
    Add middleware to the app, including CORS middleware configured
    with allowed origins specified in settings.

    This function is designed to be extensible for future middleware additions
    such as authentication, request logging, and rate limiting
    """
    add_cors_middleware(application, config.allowed_origins)

    # Future middleware can be added here, e.g.:
    # - AuthenticationMiddleware
    # - RequestLoggingMiddleware
    # - RateLimitingMiddleware


def register_routes(application: FastAPI) -> None:
    """
    Register API routers, currently including the LLM assumptions router
    which handles endpoints for analyzing user prompts and AI responses.

    This function is designed to be easily extended with additional routers for:
    - Support for multiple LLM providers/endpoints.
    - Other feature sets such as user management, analytics, or admin routes.
    """
    application.include_router(LLM_assumptions_router)

    # Future routers can be added here, e.g.:
    # application.include_router(user_management_router)


@asynccontextmanager
async def lifespan(application: FastAPI):
    """
    Lifespan context manager to handle startup and shutdown logic.

    This is where shared resources like LLM providers are initialized and cleaned up, and
    where future database connections will be initialized and cleaned up.
    """
    logging.info("Starting GlassOS...")

    # Access config and set up shared provider
    config = application.state.config
    application.state.providers = {
        provider_name: get_provider_instance(provider_name, config)
        for provider_name in ["openai"]  # Will expand this list as I add more providers
    }

    yield

    logging.info("Shutting down GlassOS...")

    # No cleanup needed for settings (simple config, plain data from environment) or
    # openai_provider (synchronous, no persistent connections)

def create_app(config: Settings = settings) -> FastAPI:
    """
    Application factory for creating a configured FastAPI app instance.

    Args:
        config: Settings object for customizing app behavior, currently
        including environment configuration, API keys, and allowed origins

    Returns:
        Configured FastAPI app instance ready to serve requests.
    """
    application = FastAPI(lifespan=lifespan)
    application.state.config = config

    setup_middleware(application, config)
    register_routes(application)

    return application


app = create_app()
