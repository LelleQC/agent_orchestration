# Project Agent Stack

This project provides a modular, containerized agent stack for developing and experimenting with various LLMs and agentic frameworks. It is designed to be run within a VS Code Dev Container, providing a consistent and reproducible environment.

## Core Features

-   **Multi-Agent Framework:** Built around a supervisor agent using **AutoGen** to orchestrate tasks.
-   **Dual Local LLMs:** Pre-configured to run both **Ollama** and **vLLM** simultaneously, allowing for easy comparison and selection of different local LLM providers.
-   **RAG Pipeline:** Includes a Retrieval-Augmented Generation pipeline using **Weaviate** as the vector database for long-term memory.
-   **Containerized Environment:** All services (agents, LLMs, databases) are managed via **Docker Compose** for a one-command setup.
-   **Integrated Development:** Develop directly inside the running `agents` container using the **VS Code Dev Containers** extension.
-   **Utility Scripts:** A set of scripts to easily manage the stack (start, stop, verify).

## Architecture

The stack is composed of several services orchestrated by Docker Compose.

```
+-------------------------------------------------------------------+
|                      Developer (VS Code)                          |
|                                                                   |
|  +-------------------------------------------------------------+  |
|  |                 Dev Container ('agents' service)              |  |
|  |                                                               |  |
|  |  +----------------------+      +---------------------------+  |  |
|  |  | Supervisor (AutoGen) |----->| Tools (wrappers.py)       |  |  |
|  |  | (supervisor.py)      |      | - Gemini CLI              |  |  |
|  |  +----------------------+      | - External Agent          |  |  |
|  |           |              |      +---------------------------+  |  |
|  |           |              |                                     |  |
|  |           v              |                                     |  |
|  |  +----------------------+      +---------------------------+  |  |
|  |  | RAG Query            |----->| LLM Client (OpenAI format)|  |  |
|  |  +----------------------+      +---------------------------+  |  |
|  |                                                               |  |
|  +-------------------------------------------------------------+  |
|                                                                   |
+------------------------+--------------------+---------------------+
                         |                    |
                         v                    v
+------------------------+--------------------+---------------------+
|                 Docker Network                                    |
|                                                                   |
|  +-----------------+  +-----------------+  +--------------------+ |
|  | Ollama          |  | vLLM            |  | Weaviate (VectorDB)| |
|  | (localhost:11434) |  | (localhost:8001)|  | (localhost:8081)   | |
|  +-----------------+  +-----------------+  +--------------------+ |
|                                                                   |
|  +-----------------+                                              |
|  | Redis           |                                              |
|  | (localhost:6379)|                                              |
|  +-----------------+                                              |
|                                                                   |
+-------------------------------------------------------------------+
```

-   **`agents` Service:** The main container where the Python-based supervisor agent runs. This is where you develop and interact with the system from within VS Code.
-   **LLM Services (`ollama`, `vllm`):** Local LLM servers that expose OpenAI-compatible APIs.
-   **`weaviate` Service:** A vector database that serves as the long-term memory for the RAG system.
-   **`redis` Service:** A fast in-memory store for short-term memory or caching.

## Getting Started

1.  **Prerequisites:**
    *   Docker and Docker Compose
    *   VS Code with the "Dev Containers" extension
    *   (For GPU acceleration) An NVIDIA GPU with the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html).

2.  **Set up Environment:**
    *   Copy `.env.template` to `.env` and fill in your `GEMINI_API_KEY`.
    ```bash
    cp .env.template .env
    ```

3.  **Build and Start Services:**
    *   This will build the Docker images and start all services.
    ```bash
    ./scripts/start_all.sh
    ```

4.  **Open in Dev Container:**
    *   Open the `project_agent_stack` folder in VS Code.
    *   Click "Reopen in Container" when prompted.

5.  **Prepare Local LLMs:**
    *   Once inside the dev container, open a terminal.
    *   Pull a model for Ollama:
    ```bash
    ollama pull llama3
    ```

6.  **Ingest Knowledge:**
    *   Add Markdown files to the `docs_to_ingest` directory. A sample file is already included.
    *   Run the ingestion script:
    ```bash
    python scripts/ingest_docs.py
    ```

7.  **Verify the Stack:**
    *   Execute the health check script to ensure all components are working.
    ```bash
    python scripts/run_checks.py
    ```
    *   This script will test connections to Docker, Redis, Weaviate, and the LLM endpoints, and then run a sample RAG query using the supervisor.

## How It Works

### LLM Services (Ollama & vLLM)

This stack runs two popular LLM serving platforms by default. Both are configured for GPU usage but can be adapted for CPU.

-   **Ollama:** A user-friendly service. After starting the stack, you must pull a model for it to use (e.g., `ollama pull llama3`).
-   **vLLM:** A high-performance server. It starts automatically with a default model (`mistralai/Mistral-7B-Instruct-v0.1`), which can be changed in `docker-compose.yml`.

**Switching between LLMs:**
The `supervisor.py` agent defaults to using Ollama. To switch to vLLM, you can:
1.  **Modify `.env`:** Change the `OLLAMA_BASE_URL` to the `VLLM_BASE_URL` value.
2.  **Modify `supervisor.py`:** Change the `base_url` in the `OpenAIClient` configuration to use the `VLLM_BASE_URL` environment variable.

### RAG Pipeline

The RAG (Retrieval-Augmented Generation) pipeline allows the agent to query a knowledge base for relevant information.

1.  **Ingestion:** The `scripts/ingest_docs.py` script scans the `docs_to_ingest` directory, chunks the documents, and stores them in the Weaviate vector database. (Note: The current implementation uses a placeholder for embeddings).
2.  **Retrieval:** The `supervisor.py` agent has a `search_knowledge_base` function that is registered as a tool. When called, it queries Weaviate and returns the most relevant document chunks.

### Key Scripts

-   `scripts/start_all.sh`: Starts all services defined in `docker-compose.yml` in detached mode.
-   `scripts/stop_all.sh`: Stops and removes all containers.
-   `scripts/verify_endpoints.sh`: A simple shell script to quickly check if the main service ports are responsive.
-   `scripts/ingest_docs.py`: Populates the Weaviate vector database with documents from the `docs_to_ingest` folder.
-   `scripts/run_checks.py`: A comprehensive health check that verifies all components of the stack, including a test of the RAG pipeline.

## Troubleshooting

-   **GPU Errors:** If you see errors related to `nvidia` or `gpu`, you likely do not have the NVIDIA Container Toolkit installed correctly. To run in CPU mode, remove the `deploy` section from the `ollama` and `vllm` services in `docker-compose.yml`.
-   **Endpoint not available:** If `run_checks.py` fails on an endpoint check, use `docker-compose ps` to see if the service is running and `docker-compose logs <service_name>` to inspect its logs.
-   **Weaviate Connection Error:** Weaviate can take a minute to start. If you get a connection error, wait a moment and try again.

## Next Steps

-   **Implement Real Embeddings:** Replace the placeholder embedding logic in `ingest_docs.py` with a call to a real embedding model (either local or API-based).
-   **Flesh out the Evaluator:** Integrate the `evaluator.py` into a full feedback loop within the supervisor.
-   **Experiment with different models:** Download new models for Ollama or configure vLLM to use a different model.
-   **Expand the knowledge base:** Add more documents to `docs_to_ingest` and re-run the ingestion script.

