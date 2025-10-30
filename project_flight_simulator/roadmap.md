# Roadmap: Simple Flight Simulator (MVP)

## New Task:
"erstelle mir gemäss agent_manual.md einen einfachen flugsimulator"

---

## 🧭 1. Initial Analysis & Planning

### MVP Scope & Strategy:
- **Goal:** Create a functional, browser-based 3D flying experience, not a realistic flight simulator. This is a Minimum Viable Product (MVP) to establish a foundation.
- **Core Technology:** The project will be built using the **Three.js** library for all 3D rendering, loaded from a CDN. This is a strategic "Buy" decision to avoid the immense complexity of building a 3D engine.
- **Physics Model:** A simplified **"Arcade Physics"** model will be used. The aircraft will move forward in the direction it is pointing. Realistic aerodynamics (lift, drag, gravity) are explicitly out of scope for this MVP.
- **Aircraft & Environment:** The aircraft will be represented by a simple geometric shape (e.g., a cone or prism). The world will consist of a simple ground plane and a sky-colored background.
- **Controls:** The aircraft will be controlled via keyboard (arrow keys) for pitch and roll.
- **Testing Approach:** Due to the complexity of testing a 3D rendered environment in an automated fashion, the primary testing method will be manual. A placeholder test will be created to verify that the canvas loads, but a full TDD cycle for the 3D logic will not be implemented.

### High-Level Feature List:
- [DONE] **Basic 3D Scene:** Render a scene with a ground and sky.
- [DONE] **Aircraft Model:** Create and display a simple 3D shape for the aircraft.
- [DONE] **Camera System:** Implement a third-person camera that follows the aircraft.
- [DONE] **User Controls:** Allow the user to control the aircraft's pitch and roll with the keyboard.
- [DONE] **Movement:** Implement the forward movement based on the aircraft's orientation.

---

## 🔁 2. Core Development Cycle

Each feature above will be implemented in sequence. Given the manual testing approach, the cycle will be:
1.  Select Feature.
2.  Implement Feature.
3.  Manually Verify Feature.
4.  Refactor if necessary.

---

## 📦 3. Finalization

After all MVP features are implemented, the standard set of documentation (`README.md`, `TUTORIAL.md`, `DEVELOPER_GUIDE.md`, `project_report.md`, `meta_learnings.md`) will be created.
