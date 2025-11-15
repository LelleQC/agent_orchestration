# Guide: Browser Automation via MCP Server

This document explains the agent's capability to interact with and verify web-based projects. This is achieved through a combination of a server and a suite of browser-control tools.

*   **What it is:** The "MCP Server" is a command-line tool (`mcp-server-playwright`) provided by the `@playwright/mcp` package. It starts a server that launches a real web browser (like Chrome) and waits for client connections.

*   **How it works:** The agent's `browser_*` tools (e.g., `browser_navigate`, `browser_click`, `browser_snapshot`) act as the client. They connect to the MCP server and send commands to automate the browser. This allows the agent to "see" and "use" the applications it builds, enabling automated testing and verification.

*   **Standard Workflow:**
    1.  **Start a local web server:** For a given project (e.g., a game), a simple server (like Python's `http.server`) is started to serve the project's files.
    2.  **Start the MCP Server:** The `mcp-server-playwright` command is run in the background.
    3.  **Execute Browser Commands:** The agent uses `browser_*` tools to navigate to the local URL, interact with elements, and take snapshots to verify functionality.
    4.  **Shutdown:** Once testing is complete, both the MCP server and the local web server are stopped.

This capability is crucial for moving beyond simple code generation to a true test-and-verify development cycle.
