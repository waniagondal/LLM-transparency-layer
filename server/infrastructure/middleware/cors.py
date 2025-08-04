"""
Module to add CORS middleware to a FastAPI application.

This module provides a utility function to configure
Cross-Origin Resource Sharing (CORS) settings on a FastAPI app,
allowing it to accept requests from specified origins.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List

def add_cors_middleware(app: FastAPI, allowed_origins: List[str]) -> None:
    """
    Adds CORS (Cross-Origin Resource Sharing) middleware to the FastAPI application.

    This enables the app to handle cross-origin requests from the specified origins,
    allowing frontend applications running on different domains to interact with this API.

    Args:
        app (FastAPI): The FastAPI application instance to which middleware will be added.
        allowed_origins (List[str]): A list of origins (URLs) allowed to access the API.

    Returns:
        None: This function modifies the app instance in place.
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
