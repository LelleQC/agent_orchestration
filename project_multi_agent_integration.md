# Projekt: Integration mehrerer Agentenansätze

Dieses Dokument beschreibt den Plan zur Umstellung des aktuellen Agentensystems auf eine modulare Architektur, die mehrere Agentenansätze (Single-Agent, Agentic RAG, Multi-Agent) unterstützt.

## 1. Initial Analysis & Planning

### 1.1. MVP Definition
Das Minimum Viable Product (MVP) ist ein System, in dem ein Orchestrator-Agent in der Lage ist, Aufgaben an verschiedene, spezialisierte Agententypen zu delegieren.

### 1.2. Technology Stack
*   Bestehender Tech-Stack des Agenten
*   Bibliotheken für Vektor-Datenbanken (z.B. ChromaDB, FAISS) für den Agentic RAG Ansatz
*   Potenziell Frameworks für Multi-Agenten-Systeme (z.B. CrewAI, AutoGen)

### 1.3. Roadmap

#### Phase 1: Grundlagen und Architektur
*   `[TODO]` Definition und Implementierung der neuen Repository-Struktur.
*   `[TODO]` Implementierung der Agentic RAG Architektur.
*   `[TODO]` Implementierung der Multi-Agenten Architektur.

#### Phase 2: Qualitätssicherung
*   `[TODO]` Implementierung der Qualitätssicherungsmechanismen (Benchmarking, Responsibility Testing, etc.).

#### Phase 3: Dokumentation
*   `[TODO]` Aktualisierung der `README.md`, um die neue Architektur widerzuspiegeln.

---

## 2. Detaillierte Informationen aus temp_plan.md

### 2.1. Repository-Struktur für mehrere Ansätze
*   **Ziel:** Eine klare, skalierbare Ordnerstruktur definieren, um verschiedene Agentenarchitekturen (Single-Agent, Agentic RAG, Multi-Agent) in diesem Repository unterzubringen.
*   **Vorgeschlagene Struktur:**
    *   `agents/`: Hauptverzeichnis für alle Agentenimplementierungen.
        *   `agents/single_agent/`: Enthält die aktuelle Single-Agent-Logik (oder einen Verweis darauf, wenn es der Kern des Hauptagenten ist).
        *   `agents/rag_agent/`: Enthält Komponenten, die spezifisch für die RAG-Implementierung sind (z.B. Skripte für das Vektor-DB-Setup, Embedding-Logik, Retrieval-Funktionen).
        *   `agents/multi_agent/`: Enthält die Orchestrator-Logik und Definitionen für spezialisierte Sub-Agenten.
        *   `agents/common/`: Gemeinsam genutzte Dienstprogramme, Tools und Schnittstellen, die von allen Agententypen verwendet werden.

### 2.2. Welche Ansätze integrieren und warum
*   **Fokus:** Agentic RAG und Multi-Agenten-Systeme.
*   **Begründung:** Diese sind im bestehenden `README.md` als logische nächste Schritte zur Verbesserung des Lernens bzw. zur Bewältigung von Komplexität identifiziert. Sie stellen eine Weiterentwicklung des aktuellen Single-Agent-Systems dar.

### 2.3. Sicherstellung eines "State-of-the-Art"-Systems (Qualitätssicherung)
*   **Ziel:** Detaillierte, umsetzbare Mechanismen definieren, um die Qualität, Zuverlässigkeit und Reproduzierbarkeit der Agentensysteme zu gewährleisten und sicherzustellen, dass sie dem aktuellen Stand der Forschung entsprechen.
*   **Grundprinzip: Mehrschichtige Qualitätssicherung für LLM-Systeme**
    Die Qualitätssicherung für LLM-Agenten unterscheidet sich fundamental von traditionellem Software-Testing. Sie konzentriert sich auf die probabilistische Natur der Modelle und die Qualität ihrer Ergebnisse. Ein moderner Ansatz erfordert eine mehrschichtige Strategie:
*   **Schlüsselmechanismen:**
    1.  **Kontinuierliches Benchmarking und Leistungsmessung:**
        *   **Was es ist:** Regelmäßige, automatisierte Tests des Agenten gegen eine standardisierte Reihe von Aufgaben (Benchmarks), um seine Leistung über die Zeit zu messen.
        *   **State-of-the-Art-Ansatz:** Moderne Benchmarks für Agenten (z.B. `AutoGenBench`, `AgentBench`, `SWE-bench`) testen spezifische Fähigkeiten wie Code-Generierung, Tool-Nutzung und logisches Denken. Wir werden einen internen Benchmark definieren (z.B. "Erstelle ein voll funktionsfähiges Pong-Spiel"), der Metriken wie **Time-to-Completion**, **Token-Kosten**, **proaktive Fehlervermeidung** und **Code-Qualität (via Linter)** erfasst.
    2.  **Funktionales und Verantwortungsvolles Testen (Responsibility Testing):**
        *   **Was es ist:** Eine Erweiterung des Testings, die sich auf die spezifischen Risiken von LLMs konzentriert.
        *   **State-of-the-Art-Ansatz:**
            *   **Halluzinationstests:** Wir entwickeln Tests, bei denen der Agent Fakten oder Code-Snippets generieren muss, die im Kontext verankert sind. Ein "LLM-as-a-judge"-Ansatz kann hier genutzt werden.
            *   **Bias- und Toxizitätstests:** Wir erstellen eine Bibliothek von "Red-Teaming"-Prompts, die den Agenten gezielt provozieren.
            *   **TDD für Agentenlogik:** Die Idee des Test-Driven Development wird auf die Agentenlogik selbst angewendet.
    3.  **Gewährleistung der Reproduzierbarkeit:**
        *   **Was es ist:** Die Fähigkeit, bei gleichen Eingaben konsistente Ergebnisse zu erzielen.
        *   **State-of-the-Art-Ansatz:**
            *   **Kontrollierte Inferenz-Parameter:** `temperature` auf einen niedrigen Wert (z.B. `0.1`) und `seed` setzen.
            *   **Strikte Versionierung:** Jede Komponente des Systems wird streng versioniert.
            *   **Detaillierte Protokollierung:** Jeder Schritt wird in einem strukturierten Log festgehalten.
    4.  **Human-in-the-Loop (HITL) für kontinuierliches Lernen:**
        *   **Was es ist:** Menschliche Überprüfung und Korrektur an kritischen Punkten.
        *   **State-of-the-Art-Ansatz:** Der Agent bittet proaktiv um Feedback bei Aufgaben mit hoher Komplexität oder Ambiguität.

### 2.4. Multi-Agenten-Orchestrierung mit Gemini CLI
*   **Ziel:** Detailliert beschreiben, wie Gemini CLI (mit Gemini 1.5 Pro) als Orchestrator für ein Multi-Agenten-System fungieren kann, indem es andere Modelle für Effizienz nutzt.
*   **Orchestrierungsrolle von Gemini CLI (Gemini 1.5 Pro):**
    *   **High-Level-Planung:** Gemini 1.5 Pro übernimmt die komplexe Aufgabenzerlegung und Koordination.
    *   **Aufgabenzuweisung:** Weist spezifische Unteraufgaben an spezialisierte Sub-Agenten zu.
    *   **Kommunikationszentrale:** Verwaltet den Input/Output zwischen den Sub-Agenten.
    *   **Entscheidungsfindung bei Komplexität:** Greift bei Konflikten ein.
*   **Integration anderer Modelle (Token-Effizienz):**
    *   **Gemini Flash:** Für Routineaufgaben mit geringerer Komplexität.
    *   **Externe Modelle/APIs:** Für sehr spezifische Aufgaben.
    *   **Mechanismus:** Der Orchestrator wählt das passende Modell dynamisch aus.
