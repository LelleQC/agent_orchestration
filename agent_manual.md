# 🤖 Autonomous Agent Operations Manual

**Objective:** This agent must independently analyze, decompose, execute, test, and document any abstract task (e.g., "Build an app," "Create a tool," "Plan a project") using only the command line. It must maintain a task decomposition document named `roadmap.md`.

---

## 🧭 1. Initial Analysis & Planning
1.  **Understand the Goal:** Read the user's input to determine the project's objective, scope, and key requirements. Define a clear Minimum Viable Product (MVP).
2.  **Assess Complexity:** Based on the goal, assess the project's complexity as 'Low', 'Medium', or 'High'. This assessment will determine the granularity of the feature breakdown.
3.  **Consult Knowledge Base:** Query the `/knowledge_base` using keywords related to the project's domain and goals (e.g., `game-physics`, `api-design`, `react-state`). Incorporate retrieved `GeneralizedPrinciple`s as requirements or tasks in the project plan.
4.  **Choose Technology:** Select an appropriate technology stack. For complex, standardized problems (e.g., chess rules), decide whether to build from scratch or integrate an existing library ("Build vs. Buy").
5.  **Select Scripting Strategy (for Web Projects):** For projects without a dedicated build toolchain (e.g., Vite, Webpack), prefer a traditional script-loading architecture (loading scripts in order via `<script>` tags in `index.html`). This approach is more robust and easier to debug than using ES6 modules with `importmap`.
6.  **Create Project Structure:** Create a dedicated subdirectory for the project.
7.  **Initial Roadmap & Checklist:** Inside the new directory, create a `roadmap.md`. This file must contain the initial analysis, the MVP definition, the chosen technology, and any principles retrieved from the knowledge base. The features or components to be built must be broken down into a high-level list, with a level of detail corresponding to the assessed complexity. **Each feature must be prefixed with a status marker (e.g., `[TODO]`).**
8.  **Stamp Version:** Read the version from the root `VERSION` file and write it into a `.agent_version` file within the new project directory to track which version of the agent process was used.

---

## 🏛️ 1.5. Repository & Git Workflow

This project operates as a **monolithic repository (mono-repo)**. All projects, including the agent's own documentation and the applications it develops (e.g., games), are stored within this single Git repository. There are no submodules or nested repositories.

**Workflow Principles:**

1.  **Centralized Commits:** All `git` commands (commit, status, log) must be run from the root directory of the `agent_orchestration` project.
2.  **Atomic Commits:** Each commit should represent a single, logical unit of work (e.g., one feature, one bug fix). Changes across multiple projects (e.g., a fix in a game and an update to the agent manual) can be included in the same commit if they are part of the same logical change.
3.  **Feature-Based Commits:** As a general rule, a commit should be made after each feature is marked as `[DONE]` in the `roadmap.md`.
4.  **No Nested Repositories:** Never run `git init` within a sub-project directory. This would create a nested repository and break the mono-repo structure.

---

## 📝 1.6. State Management for Autonomous Tasks

To ensure true autonomy during long-running, multi-step tasks (especially complex debugging), a state management system is a core requirement. This prevents context loss between turns and avoids inefficient, repetitive user confirmations.

1.  **Externalize the Plan:** Before starting a task, write the high-level plan and the current step to a designated state file (e.g., the project's `roadmap.md` or a dedicated `debug_context.md`).
2.  **Consult the Plan:** At the beginning of each turn, read the state file to re-orient, confirm the high-level goal, and identify the next immediate action.
3.  **Update the Plan:** After completing an action, update the state file to mark the step as complete and indicate the new current step.
4.  **Handover Protocol:** In case of an impending token limit or other interruption, create a detailed `handover_context.md` file and update the primary state file to point the next agent instance to it. This ensures a seamless transfer of context.

---

## 🔁 2. Core Development Cycle (Test-Driven)

This cycle is to be repeated for **each feature** listed in the `roadmap.md`.

1.  **Select Feature:** Choose the next, smallest, and most logical feature from the roadmap that is marked as `[TODO]`.
2.  **Update Status:** Immediately change the feature's status in `roadmap.md` from `[TODO]` to `[IN PROGRESS]`.
3.  **Decompose and Write a Failing Test (Test Development Sub-Cycle):** Before writing any implementation code, define the feature's requirements as an automated test. This step is a project in itself.
    -   **A. Analyze Test Requirements:** Determine *what* and *how* to test. For interactive or complex applications, this involves identifying needs for simulation, state access, and logic isolation.
    -   **B. Decompose the Test Task:** If the test is non-trivial, break down the task of creating it into smaller steps in `roadmap.md`. Use a `[TEST-TODO]` prefix for these sub-tasks.
        -   *Example Sub-Tasks:* Create mock objects, simulate user input (e.g., `simulateKeyPress('ArrowLeft')`), expose internal state (e.g., `getGameState()`), or isolate logic from rendering.
    -   **C. Implement Test Infrastructure:** Write the code for the `[TEST-TODO]` sub-tasks first. This builds the necessary tools for writing the final test.
    -   **D. Write the Final Failing Test:** With the infrastructure in place, write the concise test that defines the feature's success criteria and is expected to fail.
    -   **E. Write Initial State Test:** For the *first feature* of any interactive application, add a dedicated test to validate the initial state. This "First Playable Action Test" ensures the application is usable from the start (e.g., a game character can perform the first jump). This test must validate that core parameters (e.g., gravity, initial forces) allow the user to perform the first required action successfully.
4.  **Run Test & Confirm Failure:** Execute the test suite and confirm that the new test fails as expected. This is a critical step to ensure the test is valid.
5.  **Implement Feature:** Write the **minimum** amount of code required to make the failing test pass.
6.  **Run Tests & Refactor:** Run the full test suite again. 
    -   If all tests pass, the feature is considered complete.
    -   Now, refactor and improve the code for clarity and efficiency, re-running tests continuously to ensure no functionality is broken.
7.  **Update Status:** Once the feature is complete and refactored, update its status in `roadmap.md` from `[IN PROGRESS]` to `[DONE]`.
8.  **Commit Feature:** Stage all changed files (`git add .`) and create a commit with a descriptive message for the completed feature (e.g., `Feat: Add user login functionality`).
9.  **Loop:** Return to Step 1 of this cycle until all features in the roadmap are marked as `[DONE]`.

---

## 💬 3. Interactive Feedback & Iteration Cycle

This cycle runs in parallel with the Core Development Cycle and is triggered by user feedback during the development process. It ensures that all interactive communication is captured, actioned, and transformed into long-term knowledge.

1.  **Log Feedback:** When the user provides feedback, reports a bug, or offers a suggestion, immediately create a new entry in the root `backlog.md` file. This file serves as the central, chronological log of all user interactions.

2.  **Structure the Entry:** Each entry must be structured to capture both the immediate problem and its context:
    ```markdown
    ---
    **ID:** BACKLOG-YYYYMMDD-HHMMSS
    **Project:** `project_name`
    **Status:** [NEW]

    **1. User Report (Verbatim):**
    > User's original message or a concise summary.

    **2. Technical Analysis (Direct Impact):**
    - A brief, technical assessment of the observed behavior and the likely root cause.

    **3. Immediate Action Plan:**
    - A clear statement of the next step (e.g., "Create new task in `roadmap.md` to fix collision detection.").
    ---
    ```

3.  **Create Actionable Task:** Convert the `Immediate Action Plan` into a formal `[TODO]` task within the project's `roadmap.md`. This integrates the feedback directly into the planned workflow. Update the backlog entry's status to `[IN PROGRESS]`.

4.  **Resolve and Analyze:** After the task is marked `[DONE]` in the `roadmap.md`, update the backlog entry to `[RESOLVED]` and add a final analysis section:
    ```markdown
    **4. Resolution & Learning (Meta-Analysis):**
    - **Project-Specific Learning:** Note any lessons learned that are specific to the current project. This insight should also be added to the `project_report.md`.
    - **Generalized Principle:** If a broader, reusable lesson was learned, formulate it as a clear principle.
    - **Knowledge Base Action:** If a generalized principle was identified, create a new, searchable entry in the `/knowledge_base` to make this knowledge available for future projects.
    ```

5.  **Loop:** This feedback cycle can be initiated at any point and is key to refining the project and improving the agent's knowledge base.

---

## 🧪 4. Testing & Validation Principles

These principles should be applied during the Core Development Cycle.

-   **Design for Testability:** Structure the application to be testable from the start. Encapsulate logic in modules/objects and provide interfaces to inspect internal state (e.g., a `getGameState()` method).
-   **Isolate the Test Environment:** Tests must be deterministic. Disable real-time loops (`setInterval`) or other asynchronous background processes during testing. The test script must have full control.
-   **Decouple Test Infrastructure:** Manage test servers or databases externally from the test script using dedicated tools (e.g., `start-server-and-test`).

---

## 📦 5. Finalization

Once the Core Development Cycle is complete, create the final documentation artifacts inside the project directory:

-   `README.md`: A concise, technical summary of the project.
-   `TUTORIAL.md`: A user-friendly, step-by-step guide for a non-technical user.
-   `DEVELOPER_GUIDE.md`: A technical guide for developers explaining the code structure and how to modify it.
-   `project_report.md`: A post-mortem of the project's execution (successes, challenges).
-   `meta_learnings.md`: An analysis of the process for the AI agent's own improvement. This **must** include a `Granularity Assessment Feedback` section analyzing the initial complexity assessment against the actual project execution, noting any features that were unexpectedly difficult and providing insights for future planning.

---

## 🚨 6. Error Handling

If an unrecoverable error occurs at any stage, document the problem in `roadmap.md`, list alternative solutions, and if necessary, ask the user for clarification. This process can also be initiated through the Interactive Feedback Cycle by logging the error in `backlog.md`.

---

## 8. Model Usage & Handover (Pro / Flash Workflow)

To optimize for cost and efficiency, a manual handover process can be initiated to switch from a more powerful model (e.g., Gemini 1.5 Pro) to a lighter model (e.g., Gemini 1.5 Flash). This process is manually triggered by the user.

**This agent cannot automatically switch models or detect API usage limits.** The workflow is as follows:

1.  **User Command:** The user works with the agent (running on the Pro model) until they decide to switch. They must give an explicit command, such as: `"Prepare for Flash handover."`
2.  **Agent Prepares for Switch:** Upon receiving the command, the agent will:
    *   Create a complete copy of the current project directory. The new directory will be named with a `_flash` suffix (e.g., `project_name` becomes `project_name_flash`).
    *   This copy serves as a safe backup of the work done by the Pro model.
    *   The agent will confirm to the user that the copy has been made and that all future work will be performed in the new directory.
3.  **User Switches Model:** The user is then responsible for changing the model to Flash in their own execution environment (e.g., via a command-line flag).
4.  **Continue Work:** The user can then continue interacting with the agent (now running on Flash) in the new `_flash` directory. If the results from the Flash model are unsatisfactory, the `_flash` directory can be deleted, and work can resume from the original project directory using the Pro model.

---

## 📜 9. Guiding Principles
-   **Clarify Active Files:** When a project contains multiple similar entry point files (e.g., `index.html`, `index_standalone.html`, `main.js`, `app.js`), or when the user reports that changes are not taking effect, proactively ask the user to confirm which file they are actively using or testing. This prevents misapplication of changes to inactive files.
-   **Autonomy:** Operate independently.
-   **Structure:** Follow the defined workflow.
-   **Clarity:** Document every step.
-   **Self-Reliance:** Attempt to solve problems before asking for help.
-   **Recursion:** Break down problems iteratively.
-   **Precision:** Use explicit and clear CLI commands.
-   **Resource-Efficiency:** Prioritize token-efficient tools. Use `search_file_content` to find specific text instead of reading entire files. For file modifications, prefer `replace` for targeted changes over `write_file` for small edits. Use quiet flags on shell commands where available to minimize output.
