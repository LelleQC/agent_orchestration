# Project Agent Stack

This project provides a modular, containerized agent stack for developing and experimenting with various LLMs and agentic frameworks. It is designed to be run within a VS Code Dev Container, providing a consistent and reproducible environment.

## Quick Start

1.  **Prerequisites:**
    *   Docker and Docker Compose
    *   VS Code with the "Dev Containers" extension
    *   (For GPU acceleration) An NVIDIA GPU with the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) installed.

2.  **Set up Environment:**
    *   Copy the `.env.template` file to `.env`.
    *   Fill in your `GEMINI_API_KEY` and any other necessary credentials.
    ```bash
    cp .env.template .env
    ```

3.  **Build and Start Services:**
    *   Run the start script. This will build the Docker images and start all services in the background.
    ```bash
    ./scripts/start_all.sh
    ```

4.  **Open in Dev Container:**
    *   Open the `project_agent_stack` folder in VS Code.
    *   When prompted, click "Reopen in Container". This will connect your VS Code instance to the `agents` service.

5.  **Prepare Local LLMs:**
    *   Once inside the dev container, open a terminal.
    *   Pull a model for Ollama to use:
    ```bash
    ollama pull llama3
    ```
    *   The vLLM service starts with a default model, but you can configure it in `docker-compose.yml`.

6.  **Ingest Knowledge:**
    *   Add any Markdown files you want to be included in the knowledge base to the `docs_to_ingest` directory.
    *   Run the ingestion script:
    ```bash
    python scripts/ingest_docs.py
    ```

7.  **Run a Test:**
    *   Execute the health check script to verify all components are working:
    ```bash
    python scripts/run_checks.py
    ```

## Architecture

The stack is composed of several services orchestrated by Docker Compose.

```
+------------------------+      +-----------------------+
|   VS Code Dev Env      |      |      Gemini CLI       |
| (Running in 'agents')  |----->| (External Tool)       |
+------------------------+      +-----------------------+
           |
           v
+------------------------+      +-----------------------+
|   Supervisor Agent     |----->|   LLM Services        |
|   (agents/supervisor.py) |      | - Ollama (localhost:11434)|
|   (AutoGen)            |      | - vLLM (localhost:8001)   |
+------------------------+      +-----------------------+
           |
           v
+------------------------+      +-----------------------+
|   Knowledge Base       |----->|   Short-Term Memory   |
|   (Weaviate @ 8081)    |      |   (Redis @ 6379)      |
+------------------------+      +-----------------------+
```

-   **`agents` Service:** The main container where the Python-based supervisor agent (using AutoGen) runs. This is also where you develop and interact with the system from within the VS Code Dev Container.
-   **LLM Services (`ollama`, `vllm`):** These are local LLM servers that expose OpenAI-compatible APIs. They are configured to use GPU resources but can be modified to run in CPU-only mode.
-   **`weaviate` Service:** A vector database that serves as the long-term memory or knowledge base for the RAG system.
-   **`redis` Service:** A fast in-memory store, intended for short-term memory, caching, or message queuing between agents.

## LLM Services

This stack supports multiple local LLM providers simultaneously.

### Ollama (Enabled by default)

-   **Description:** A user-friendly service for running a wide range of open-source models.
-   **GPU Requirement:** The service is configured for GPU use. To run on CPU, remove the `deploy` section from the `ollama` service in `docker-compose.yml`.
-   **Usage:** After starting the stack, you must pull a model. From the dev container terminal, run:
    ```bash
    ollama pull llama3
    ```

### vLLM (Enabled by default)

-   **Description:** A high-performance serving library optimized for fast inference.
-   **GPU Requirement:** Requires a powerful NVIDIA GPU. If you don't have one, comment out the `vllm` service in `docker-compose.yml`.
-   **Usage:** The service starts automatically with a default model (`mistralai/Mistral-7B-Instruct-v0.1`). You can change this by editing the `command` in the `docker-compose.yml`.

## RAG and Knowledge Base

The system uses a Retrieval-Augmented Generation (RAG) pipeline to provide agents with relevant information from a knowledge base.

-   **Vector DB:** Weaviate is used to store document embeddings.
-   **Ingestion:** The `scripts/ingest_docs.py` script is used to process documents.
    1.  Place your Markdown files in the `docs_to_ingest` directory.
    2.  Run `python scripts/ingest_docs.py`. This will create a Weaviate collection named `DocumentChunk` and ingest the content.
-   **Querying:** The `supervisor.py` agent contains a `search_knowledge_base` function that queries Weaviate to retrieve relevant document chunks based on a natural language query.

## Evaluation and Testing

The project includes scripts to verify the health of the stack and evaluate agent performance.

-   **`scripts/run_checks.py`:** This script runs a series of health checks against all services, including Docker, Redis, Weaviate, and the LLM endpoints. It also runs a sample RAG query.
-   **`agents/evaluator.py`:** This file contains a template for an "evaluator" agent. It can be used to programmatically assess the output of other agents for correctness and quality.

## Troubleshooting

-   **GPU Errors:** If you see errors related to `nvidia` or `gpu` during startup, it likely means the NVIDIA Container Toolkit is not installed correctly, or you do not have a compatible GPU. In this case, either disable the `deploy` section in the `ollama` and `vllm` services in `docker-compose.yml` to run them in CPU mode (if supported) or comment them out entirely.
-   **Endpoint not available:** If `run_checks.py` reports that an endpoint is not responsive, ensure the corresponding service is running correctly with `docker-compose ps`. Check the service logs with `docker-compose logs <service_name>`.
-   **Weaviate Connection Error:** Ensure the Weaviate container is running and healthy. It can sometimes take a minute to start up fully.

## Next Steps

-   **Implement more tools:** Add more tool wrappers in `agents/tools/` for the supervisor to use.
-   **Flesh out the evaluator:** Integrate the `evaluator.py` into a full feedback loop within the supervisor.
-   **Experiment with different models:** Download new models for Ollama or configure vLLM to use a different model.
-   **Expand the knowledge base:** Add more documents to `docs_to_ingest` and re-run the ingestion script.

