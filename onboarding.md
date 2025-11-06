# Onboarding Guide for Agent Orchestration

Welcome to the agent orchestration project. This guide is for developers who want to understand and contribute to the agent's own thinking and development process, rather than working on one of the projects it is building.

## Understanding the Environment

This repository is designed to be a self-improving system where an AI agent can autonomously manage software development projects. The core of this system is defined by a set of documents that guide the agent's behavior.

### Key Files and Directories

*   **`agent_manual.md`**: This is the most important file. It contains the standard operating procedures for the agent, detailing the entire workflow from initial analysis and planning to development, testing, and finalization. If you want to change how the agent behaves, this is the first place to look.

*   **`project_documentation.ipynb`**: This Jupyter Notebook contains high-level documentation about the agent system itself. It includes architectural descriptions, evaluations, and future outlooks.

*   **`onboarding.md` (This file)**: You are here. This file is intended to be the starting point for anyone new to this system.

*   **`backlog.md`**: A chronological log of all interactions with the agent, including user feedback, bug reports, and suggestions. This is crucial for the agent's learning process.

*   **`meta_learnings.md`**: This file is for the agent's own self-reflection. It records insights and lessons learned about its own performance and processes, helping it to improve over time.

*   **`VERSION`**: A simple text file containing the current version of the agent's operational process. This is used to track which version of the agent created a project.

*   **`WORKFLOW_REPORT.ipynb`**: This notebook is likely used for generating reports about the agent's workflow and performance.

*   **`knowledge_base/`**: A directory containing markdown files with generalized principles and solutions that the agent can consult for future projects.

*   **`project_*/`**: Each of these directories represents a distinct project that the agent is working on. They contain the source code, documentation, and the agent's `roadmap.md` for that specific project.

## How to Contribute to the Agent's Process

If you want to modify or improve the agent's core logic, follow these steps:

1.  **Understand the Current Process**: Start by thoroughly reading `agent_manual.md` to understand the existing workflow.
2.  **Consult the Documentation**: Read `project_documentation.ipynb` to understand the high-level concepts and goals of the system.
3.  **Review Past Learnings**: Look at `meta_learnings.md` and `backlog.md` to see what has been tried before and what the agent has learned from its mistakes.
4.  **Propose a Change**: If you have an idea for an improvement, you can modify `agent_manual.md` or any other relevant file.
5.  **Test Your Change**: The ultimate test of any change is to observe how it affects the agent's performance on a new or existing project.

Your goal is to improve the agent's ability to work autonomously and effectively. By improving the process files, you are directly teaching the agent how to be a better developer.
