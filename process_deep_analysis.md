# Process: Deep Analysis

This document outlines the process for generating the `deep_analysis.md` file. This is a comprehensive analysis of the entire repository, designed to give the agent a deep, holistic understanding of all projects and its own meta-processes.

## 1. Purpose

The "Deep Analysis" process scans and synthesizes information from all projects and the agent's own learning files (`backlog.md`, `meta_learnings.md`, `knowledge_base/`). The goal is to create a single source of truth about the state of the repository, identify global patterns, and inform strategic decisions. This process is an extension of the standard onboarding and is crucial for tasks related to the agent's self-improvement.

## 2. Naming Convention

*   **Markdown File:** `deep_analysis.md` (located in the root directory)

## 3. The Process

This process can be initiated by a user's request (e.g., "Run a deep analysis" or "Update the analysis file").

1.  **Analyze Learning Files:** The agent will first read and parse the core learning files:
    *   `meta_learnings.md`
    *   `backlog.md`
    *   All files within `knowledge_base/`

2.  **Analyze Projects:** The agent will scan all `project_*/` directories. For each project, it will gather:
    *   The project's `roadmap.md` to determine feature completion status.
    *   The project's `project_report.md` to extract key learnings and metrics.
    *   The project's structure and dependencies.

3.  **Synthesize Findings:** The agent will then synthesize all collected information into the `deep_analysis.md` file, using the following structure:

    ---
    # Deep Analysis Report

    *Last Updated: YYYY-MM-DD HH:MM:SS*

    ## 1. Global Learnings & Processes

    A summary of the agent's own operational knowledge.
    - **Meta-Learnings:** A synthesis of key insights from `meta_learnings.md` about the agent's own performance and process improvements.
    - **Backlog Summary:** A high-level overview of recent user feedback and bug reports from `backlog.md`, noting any open or recurring issues.
    - **Knowledge Base Principles:** A list of all generalized principles currently stored in the `knowledge_base/`.

    ## 2. Global Project Assessment

    A high-level summary of all development projects.
    - **Total Projects:** X
    - **Overall Health:** A summary of project health, noting common strengths (e.g., documentation) and weaknesses (e.g., test coverage).

    ## 3. Project-Specific Analysis

    *(Repeat this section for each project)*

    ### Project: `project_name`

    *   **Current Status:**
        -   **Completed Features:** X/Y
        -   **Summary:** A brief, human-readable summary of the project's purpose and current state based on its roadmap and project report.

    *   **Key Learnings & Metrics:**
        -   A summary of the specific learnings documented in the project's `project_report.md`.
        -   **Performance Metrics:** (e.g., Time to Prototype, Test Coverage, if available).

    *   **Recommended Next Steps:**
        -   **Short-Term:** Concrete, actionable recommendations for the project.
        -   **Long-Term:** Strategic suggestions, such as abstracting components for the knowledge base.
    ---

4.  **Commit the Changes:** The agent will commit the updated `deep_analysis.md` file with a clear commit message, such as `docs: Update deep analysis report`.