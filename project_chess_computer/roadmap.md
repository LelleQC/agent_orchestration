# Roadmap: Chess Computer Update

## - PHASE 1: FIX THE "NOT REACTING" ISSUE

### HYPOTHESIS
The "not reacting" issue is likely because the AI is a "random mover", as stated in the original `project_report.md`. The fix is to replace this with an intelligent chess engine.

### ACTION PLAN
1.  **Analyze `script.js`:** Read the current AI logic to confirm the random-move behavior.
2.  **Integrate Stockfish:** The presence of `stockfish_worker.js` suggests the Stockfish engine is available. I will modify `script.js` to use this worker to get an intelligent move from the Stockfish engine instead of a random one.

---

## - PHASE 2: IMPLEMENT ELO POWER ADJUSTMENT

### GOAL
Allow the user to adjust the difficulty of the Stockfish AI.

### ACTION PLAN
1.  **Update UI:** Add a slider or input field to `index.html` to allow the user to select a difficulty level.
2.  **Connect UI to Engine:** In `script.js`, listen for changes to the new UI element.
3.  **Configure Stockfish:** When the difficulty changes, send the appropriate "Skill Level" command to the Stockfish engine. Stockfish supports a skill level from 0 (easiest) to 20 (hardest).

---

I will now begin with Phase 1.