# Projekt: CoppeliaSim Integration

Dieses Dokument beschreibt den Plan zur Integration des Agentensystems mit dem CoppeliaSim-Simulator zur Steuerung eines Haushaltsroboters.

## 1. Initial Analysis & Planning

### 1.1. MVP Definition
Das Minimum Viable Product (MVP) ist ein System, in dem der Agent eine Verbindung zu CoppeliaSim herstellen und eine einfache Aufgabe ausführen kann, z.B. den Roboter zu einem bestimmten Ort bewegen.

### 1.2. Technology Stack
*   CoppeliaSim
*   Python Remote API

### 1.3. Roadmap

#### Phase 1: Konnektivität und grundlegende Steuerung
*   `[TODO]` Aufbau der Kommunikation mit CoppeliaSim über die Python Remote API.
*   `[TODO]` Implementierung einer Single-Agent-Architektur zur grundlegenden Robotersteuerung.

#### Phase 2: Fortgeschrittene Steuerung und Lernen
*   `[TODO]` Implementierung einer Agentic RAG-Architektur zum Lernen aus Robotererfahrungen.
*   `[TODO]` Implementierung eines Multi-Agenten-Systems für komplexe Roboteraufgaben.

#### Phase 3: Herausforderungen und Robustheit
*   `[TODO]` Adressierung der Herausforderungen von Echtzeit-Interaktion, Sensordatenverarbeitung und Fehlerbehandlung.

---

## 2. Detaillierte Informationen aus temp_plan.md

### 2.1. Verbindungsstrategie
*   **Ziel:** Eine Kommunikationsbrücke zwischen dem Gemini CLI Agenten und CoppeliaSim herstellen.
*   **Optionen:**
    *   **CoppeliaSim Remote API (Python/C++/Java/Lua):** Die direkteste und robusteste Methode.
    *   **Dateibasierte Kommunikation:** Weniger Echtzeit, robuster für asynchrone Aufgaben.
    *   **Benutzerdefinierter Webserver/Socket:** Komplexere Einrichtung, aber Echtzeit.
*   **Empfehlung:** Beginn mit der CoppeliaSim Python Remote API für direkte Steuerung und Feedback.

### 2.2. Anwendung von Agentenarchitekturen auf Roboteraufgaben
*   **Single-Agent:**
    *   **Rolle:** Grundlegende Aufgabenausführung (z.B. "Gehe zur Küche", "Objekt aufheben").
    *   **Einschränkungen:** Fehlt Lernfähigkeit, Schwierigkeiten bei unerwarteten Ereignissen.
*   **Agentic RAG:**
    *   **Rolle:** Roboter lernt aus vergangenen Erfahrungen/Fehlern (z.B. "Wie man Hindernisse im Flur vermeidet").
    *   **Wissensbasis:** Incident Reports von fehlgeschlagenen Roboteraktionen, optimale Pfadplanungsdaten, Objekterkennungsmuster.
*   **Multi-Agenten-System:**
    *   **Orchestrator (Gemini CLI):** High-Level-Aufgabenplanung ("Reinige das Wohnzimmer").
    *   **Wahrnehmungsagent:** Verarbeitet Sensordaten.
    *   **Navigationsagent:** Plant Pfade, vermeidet Hindernisse.
    *   **Manipulationsagent:** Steuert Roboterarm/-greifer.
    *   **Aufgabenüberwachungsagent:** Überprüft, ob Unteraufgaben abgeschlossen sind.
    *   **Lernagent (RAG-fähig):** Speist Erfahrungen in die Wissensbasis zurück.

### 2.3. Wichtige Herausforderungen/Überlegungen
*   **Echtzeit-Interaktion:** Roboteraufgaben erfordern oft schnelle Reaktionen.
*   **Sensordatenverarbeitung:** Interpretation von visuellen, Tiefen- und anderen Sensordaten.
*   **Aktionsausführung & Feedback:** Übersetzung von High-Level-Befehlen in Low-Level-Roboterbewegungen und Überprüfung der Ausführung.
*   **Fehlerbehandlung & Wiederherstellung:** Was passiert, wenn der Roboter eine Aufgabe nicht erfüllt? Wie lernt er und erholt sich?
