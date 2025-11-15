import subprocess
import json
import requests

# --- Configuration ---
# Base URL for an external agent system, if available
# This should be configured via environment variables in a real setup
EXTERNAL_AGENT_BASE_URL = "http://localhost:5000"


def run_gemini_cli(prompt: str) -> str:
    """
    Executes a prompt using the Gemini CLI via a subprocess.

    Args:
        prompt: The prompt to send to the Gemini CLI.

    Returns:
        The output from the Gemini CLI.
    """
    try:
        # Note: This assumes the 'gemini' command is available in the environment's PATH.
        # In the devcontainer, this would need to be installed and configured.
        process = subprocess.run(
            ["gemini", "chat", "--input", prompt],
            capture_output=True,
            text=True,
            check=True
        )
        return process.stdout
    except FileNotFoundError:
        return "Error: 'gemini' command not found. Please ensure the Gemini CLI is installed and in the system's PATH."
    except subprocess.CalledProcessError as e:
        return f"Error executing Gemini CLI: {e}\n{e.stderr}"


def call_external_agent(prompt: str, task_id: str = "task_001") -> dict:
    """
    Calls an external agent system via its HTTP API.

    This follows the API contract defined in the project documentation.

    Args:
        prompt: The prompt for the agent.
        task_id: A unique identifier for the task.

    Returns:
        A dictionary containing the agent's response.
    """
    api_endpoint = f"{EXTERNAL_AGENT_BASE_URL}/run"
    payload = {
        "task_id": task_id,
        "task_type": "generic",
        "prompt": prompt,
        "context": {},
        "max_tokens": 1024
    }
    try:
        response = requests.post(api_endpoint, json=payload, timeout=120)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()
    except requests.exceptions.RequestException as e:
        return {
            "task_id": task_id,
            "status": "error",
            "result": f"Failed to call external agent: {e}",
            "logs": []
        }

# --- Example Usage ---
if __name__ == "__main__":
    print("--- Testing Gemini CLI Wrapper ---")
    gemini_response = run_gemini_cli("Explain the importance of modularity in software engineering in one sentence.")
    print(gemini_response)

    print("\n--- Testing External Agent Wrapper ---")
    # This will likely fail unless a service is running on EXTERNAL_AGENT_BASE_URL
    external_response = call_external_agent("Summarize the state of AI in 2025.")
    print(json.dumps(external_response, indent=2))
