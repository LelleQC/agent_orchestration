# Onboarding Guide for Agent Orchestration

Welcome to the agent orchestration project. This guide defines the processes for initializing the agent's operational context.

---

## 1. Standard Onboarding (Lightweight)

This is the default, token-efficient process required for the agent to begin work on a specific project (e.g., developing a game). It provides the agent with its core operational instructions without analyzing the entire repository.

### Process:
When asked to perform onboarding, the agent will read the following two files:
1.  **`agent_manual.md`**: The primary Standard Operating Procedures (SOPs) that govern all agent behavior.
2.  **`VERSION`**: The current version of the agent's process, used for tracking and reproducibility.

After this process, the agent is fully equipped to develop, test, and document a project according to its manual.

---

## 2. Optional: Deep Analysis

This is a separate, on-demand process designed for when a deep, holistic understanding of the entire repository is required. It is particularly useful for developers working on improving the agent's own systems or for strategic planning.

This process should be run intentionally and is not part of the standard onboarding.

*   **What it is:** The "Deep Analysis" is a detailed report (`deep_analysis.md`) that provides a snapshot of all projects and the agent's own learning files (`backlog.md`, `meta_learnings.md`, etc.). It synthesizes this information to create a complete picture of the repository's state.

*   **Why it is useful:** It helps to understand the current state of the repository at a glance, identify systemic weaknesses or patterns (e.g., lack of testing in multiple projects), and decide where to focus improvement efforts. After running this, the agent is fully informed about every aspect of the project.

*   **How to run it:** Simply ask the agent: **`"Run a deep analysis"`**.

*   **Process Details:** For the detailed steps the agent follows to create this report, consult the `process_deep_analysis.md` file.

---

## 3. Core Capabilities

The agent possesses several core capabilities that are documented in the `knowledge_base` directory. Understanding these is key to leveraging the agent effectively.

*   **Mandatory Verification for Web Projects:** When working on a project that results in a web interface (e.g., a game, a web app), the agent **must** verify its work by using its browser automation capabilities. This involves launching the application on a local server and using the `browser_*` tools to ensure it loads and functions correctly. The technical details of this process are documented in the [Browser Automation via MCP Server](./knowledge_base/mcp_server_guide.md) guide.

