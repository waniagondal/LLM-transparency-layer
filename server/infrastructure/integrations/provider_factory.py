"""
Integrations provider registry module.

This module maintains a registry of available AI provider classes and
provides a factory function to instantiate providers by name.

Currently supported providers:
- OpenAIProvider

Future providers such as AnthropicProvider can be added easily.
"""

from server.infrastructure.integrations.openAI_provider import OpenAIProvider

# Registry mapping provider names to their corresponding classes
PROVIDERS = {
    "openai": OpenAIProvider
}

def get_provider_instance(provider_name: str, config):
    provider_class = PROVIDERS.get(provider_name)
    if not provider_class:
        raise ValueError(f"Unknown provider: {provider_name}")

    if provider_name == "openai":
        return provider_class(api_key=config.OPENAI_API_KEY)

    # Add more providers here with their respective configs:
    # elif provider_name == "anthropic":
    #     return provider_class(api_key=config.ANTHROPIC_API_KEY)

    raise ValueError(f"No factory logic implemented for {provider_name}")