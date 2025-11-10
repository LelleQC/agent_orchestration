# Dokumentation: Autonomes Agenten-System

**Version: 1.0.0**

Dieses Dokument beschreibt die Architektur, die Ziele und den strategischen Entwicklungspfad dieses autonomen Agenten-Systems. Es dient als zentrale Anlaufstelle, um das aktuelle System zu verstehen, es im Kontext moderner KI-Forschung einzuordnen und die nächsten Schritte zur Erreichung echter Autonomie zu planen.

## 1. Vision & Kernphilosophie

Das Projekt verfolgt zwei miteinander verbundene Hauptziele:

1.  **Funktionale Autonomie:** Die Entwicklung eines Agenten, der komplexe, abstrakt definierte Aufgaben (z.B. "Erstelle ein Spiel") selbstständig in konkrete Schritte zerlegen, ausführen, testen und dokumentieren kann.
2.  **Evolutionäre Kompetenz (Lernfähigkeit):** Die Schaffung eines Systems, das mit jeder Aufgabe und jedem Fehler lernt. Der Agent soll ein "Gedächtnis" entwickeln, um vergangene Fehler proaktiv zu vermeiden und Best Practices über Projektgrenzen hinweg zu generalisieren.

**Unsere Kernphilosophie: Prozess-getriebene Zuverlässigkeit**

Im Gegensatz zu "Open-Ended"-Agenten (wie dem ursprünglichen AutoGPT), die oft unvorhersehbar agieren und in Schleifen geraten können, verfolgt dieses Projekt einen **prozess-getriebenen Ansatz**. Wir sehen den `agent_manual.md` nicht als Einschränkung, sondern als ein bewusst gewähltes "Betriebssystem", das Zuverlässigkeit, Qualität und Nachvollziehbarkeit erzwingt. Das Ziel ist nicht, den schnellsten oder kreativsten Agenten zu bauen, sondern den **zuverlässigsten und diszipliniertesten Ingenieur**.

---

## 2. Aktuelle Systemarchitektur (Version 1.0.0)

Die Architektur basiert auf einem deterministischen Kreislauf, der durch klar definierte Prozesse und einen strukturierten Lernmechanismus gestützt wird.

```
+---------------------------+
|      User-Anweisung       |
+-------------+-------------+
              |
              v
+-------------+-------------+
|   AGENT (LLM) folgt dem   |
|    `agent_manual.md`      |
+-------------+-------------+
              |
              v
+-----------------------------------------------------------------+
| KREISLAUF: Plan -> Test -> Implement -> Refactor -> Commit -> Doc |
+---------------------------+-------------------------------------+
                            |
+---------------------------+-------------------------------------+
| LERNEN: Bei Fehler -> Incident Report -> Generalisierung -> WISSEN |
+-----------------------------------------------------------------+
```

### 2.1 Das "Betriebssystem": `agent_manual.md`

Das Herzstück des Agenten. Es schreibt einen strengen, testgetriebenen Entwicklungszyklus (TDD) vor, der Qualität und Funktionalität sicherstellt:

1.  **Planung:** Analyse der Aufgabe und Erstellung einer `roadmap.md`.
2.  **Testen:** Für jedes Feature wird zuerst ein fehlschlagender Test geschrieben.
3.  **Implementierung:** Minimaler Code, um den Test erfolgreich zu machen.
4.  **Refactoring:** Verbesserung des Codes.
5.  **Commit:** Automatische, atomare Git-Commits nach jedem Feature.
6.  **Dokumentation:** Erstellung der finalen Dokumente nach Abschluss.

### 2.2 Das "Gedächtnis": Der Incident-Knowledge-Loop

Dies ist der erste Schritt zu einem lernfähigen System.

1.  **Fehleranalyse:** Ein behobener Fehler wird in einem **`Incident Report`** im `/knowledge_base`-Ordner dokumentiert.
2.  **Generalisierung:** Aus der spezifischen Lösung wird ein allgemeingültiges **Prinzip** abgeleitet.
3.  **Wissensanwendung:** Bei **neuen** Projekten wird die Wissensdatenbank konsultiert. Relevante Prinzipien werden zu proaktiven Aufgaben in der neuen `roadmap.md`, um bekannte Fehler von vornherein zu vermeiden.

### 2.3 Unterstützende Säulen: Versionierung & Git-Workflow

-   **Versionierung:** Eine `VERSION`-Datei im Root und `.agent_version` in jedem Projekt stempeln den genauen Prozess, nach dem ein Projekt erstellt wurde.
-   **Automatischer Git-Workflow:** Der Agent erstellt nach jedem abgeschlossenen Feature eigenständig einen Commit. Dies sorgt für eine saubere, nachvollziehbare Git-Historie.

---

## 3. System-Bewertung: Stärken, Schwächen & Einordnung

### 3.1 Aktueller Stand

| Stärken (Pros) | Schwächen (Cons) |
| :--- | :--- |
| **Struktur & Vorhersehbarkeit:** Der rigide Prozess sorgt für disziplinierte, nachvollziehbare Ergebnisse. | **Reaktivität & "Blindheit":** Der Agent kann seine Arbeit nicht selbst "sehen" oder "benutzen". Er ist auf menschliches Feedback zur Fehlererkennung angewiesen. |
| **Qualitätssicherung durch TDD:** Der testgetriebene Ansatz sichert die logische Korrektheit. | **Starrer Prozess:** Ineffizienzen im `agent_manual.md` werden wiederholt, statt den Prozess selbst zu optimieren. |
| **Grundstein für Lernen:** Der 'Incident-Knowledge-Loop' ist eine robuste Grundlage für zukünftige RAG-Systeme. | **Begrenzte Wissensanwendung:** Die simple Keyword-Suche schränkt das Lernen auf explizit ähnliche Probleme ein. |
| **Saubere Git-Historie:** Automatische, atomare Commits schaffen eine mustergültige Versionsgeschichte. | **Begrenzte Test-Tiefe:** TDD sichert Logik, aber keine User Experience (UX) oder visuelle Aspekte. |

### 3.2 Einordnung in die KI-Agenten-Landschaft (Stand 2025)

Um unser System einzuordnen, vergleichen wir es mit den dominanten Architekturen in der aktuellen Forschung.

| Architektur | Beschreibung | Stärken (Pros) | Schwächen (Cons) | Ideal für... |
| :--- | :--- | :--- | :--- | :--- |
| **Single-Agent + Tools** | Ein zentrales LLM wählt aus einem Set von Werkzeugen (APIs, Funktionen), um eine Aufgabe zu lösen. | - **Einfach & Robust:** Leicht zu implementieren und zu debuggen.<br>- **Direkte Kontrolle:** Der Weg von Anweisung zu Ausführung ist klar nachvollziehbar. | - **Wissens-Amnesie:** Lernt nicht über eine Sitzung hinaus.<br>- **Reaktiv:** Kann Fehler nicht proaktiv vermeiden.<br>- **Skalierungsgrenze:** Stößt bei sehr komplexen Aufgaben an seine Grenzen. | Klar definierte, in sich geschlossene Aufgaben (z.B. "Erstelle ein Snake-Spiel"). |
| **Agentic RAG** | Ein Agent, der seine Aktionen auf Basis von Informationen plant, die er dynamisch aus Wissensdatenbanken abruft (Retrieval-Augmented Generation). | - **Lernfähig:** Generalisiert aus vergangenen Fehlern.<br>- **Proaktiv:** Kann bekannte Probleme von vornherein vermeiden.<br>- **Effizienter:** Löst bekannte Probleme schneller und mit weniger Schritten. | - **Komplexere Einrichtung:** Benötigt eine Vektor-Datenbank und Embedding-Prozesse.<br>- **Abhängig von Qualität:** Die Leistung hängt stark von der Qualität der Wissensdatenbank ab. | Aufgaben, bei denen ähnliche Probleme wiederholt auftreten (z.B. Debugging von Web-Anwendungen). |
| **Multi-Agenten-Systeme** | Mehrere spezialisierte Agenten (z.B. "Planer", "Coder", "Tester") kollaborieren, um eine komplexe Aufgabe zu lösen (z.B. in Frameworks wie CrewAI, AutoGen). | - **Hohe Spezialisierung:** Jeder Agent ist Experte für seine Domäne.<br>- **Parallelisierung:** Aufgaben können parallel bearbeitet werden.<br>- **Robustheit:** Ergebnisse werden durch "interne Reviews" (z.B. Tester prüft Code) besser. | - **Hohe Komplexität:** Orchestrierung und Kommunikation zwischen Agenten sind aufwendig.<br>- **Overhead:** Kann für einfache Aufgaben "zu viel des Guten" sein.<br>- **Kosten:** Mehr Agenten bedeuten potenziell höhere Token-Kosten. | Große, komplexe und langlebige Projekte (z.B. "Entwickle eine komplette E-Commerce-Plattform").

---

## 4. Der Weg zu größerer Autonomie: Eine strategische Roadmap

Dies ist ein Leitfaden für die nächsten Entwicklungsschritte, um die Autonomie und Intelligenz des Systems systematisch zu steigern.

### Schritt 1: Proaktive Selbst-Verifikation (Von "Blind" zu "Bewusst")

**Problem:** Der Agent ist "blind" und kann nicht prüfen, ob seine Web-Anwendung tatsächlich funktioniert.

**Lösung:** Implementierung einer automatisierten **Verifikations-Phase** am Ende des Entwicklungszyklus.

1.  **Funktionale Tests:** Der Agent startet die Web-Anwendung auf einem lokalen Server und nutzt **Headless-Browser-Tools** (z.B. Playwright), um zu prüfen:
    -   Lädt die Seite ohne Konsolenfehler?
    -   Sind die Hauptelemente (z.B. Spiel-Canvas, Buttons) im DOM vorhanden?
    -   Kann eine Basis-Interaktion simuliert werden (z.B. ein Klick)?
2.  **Visuelle Verifikation (VLM):** Als fortgeschrittener Schritt könnte der Agent einen Screenshot der Anwendung an ein **multimodales Modell (VLM)** senden und gezielte Fragen stellen:
    -   "Wird auf diesem Screenshot ein Spiel korrekt gerendert oder ist der Bildschirm schwarz?"
    -   "Ist das Layout dieser Seite fehlerhaft?"

**Ergebnis:** Der Agent kann seine Arbeit selbstständig validieren und bei Fehlern autonom einen neuen `Incident-Knowledge-Loop` starten, ohne auf menschliches Feedback angewiesen zu sein.

### Schritt 2: Fortgeschrittenes Lernen (Implementierung von echtem RAG)

**Problem:** Das aktuelle "Gedächtnis" ist keyword-basiert und kann keine konzeptionellen Zusammenhänge erkennen.

**Lösung:** Umwandlung der Wissensdatenbank in ein echtes **Retrieval-Augmented Generation (RAG)** System.

1.  **Embedding:** Jeder `Incident Report` wird beim Speichern durch ein Text-Embedding-Modell (z.B. `text-embedding-ada-002`) in einen Vektor umgewandelt.
2.  **Vektor-Datenbank:** Diese Vektoren werden in einer lokalen Vektor-Datenbank (z.B. ChromaDB, FAISS) gespeichert.
3.  **Semantische Suche:** Bei der Planung eines neuen Projekts formuliert der Agent eine semantische Anfrage (z.B. "Wie stelle ich sicher, dass die grundlegende Spielphysik funktioniert?") und erhält die relevantesten vergangenen Lektionen zurück, auch wenn die Keywords nicht exakt passen.

**Ergebnis:** Der Agent lernt auf einer konzeptionellen Ebene und kann Wissen aus vergangenen Projekten viel effektiver auf neue, unterschiedliche Aufgaben anwenden.

### Schritt 3: Multi-Agenten-Architektur (Vom Solo-Entwickler zum Team)

**Problem:** Ein einzelner Agent muss alle Aufgaben (Planung, Code, Test, Doku) beherrschen, was bei steigender Komplexität ineffizient wird.

**Lösung:** Aufteilung des Systems in ein **kollaboratives Multi-Agenten-System**, inspiriert von Frameworks wie MetaGPT oder CrewAI.

-   **`Manager-Agent`:** Zerlegt die Hauptaufgabe, pflegt die `roadmap.md` und koordiniert die anderen Agenten.
-   **`Entwickler-Agent`:** Schreibt den Code basierend auf den Spezifikationen des Managers.
-   **`Tester-Agent`:** Schreibt die Tests und führt die in Schritt 1 definierte Verifikation durch.
-   **`Doku-Agent`:** Schreibt die Dokumentation, nachdem die Features implementiert und getestet wurden.

**Ergebnis:** Höhere Spezialisierung und Effizienz, robustere Ergebnisse durch "Cross-Validation" zwischen den Agenten und eine klarere Trennung der Verantwortlichkeiten.

### 4.5 Analyse der Roadmap-Schritte und Integrationsstrategien

Die vorgeschlagenen Schritte zur Steigerung der Autonomie lassen sich hinsichtlich ihrer Natur und Integrationsweise kategorisieren:

#### 4.5.1 Kategorisierung der Roadmap-Schritte

1.  **Schritt 1: Proaktive Selbst-Verifikation (Von "Blind" zu "Bewusst")**
    *   **Kategorie:** **Offensichtlicher/Logischer Schritt.**
    *   **Begründung:** Dies ist eine direkte und notwendige Verbesserung der aktuellen "blinden" Arbeitsweise des Agenten. Die Fähigkeit, die eigene Arbeit (insbesondere UI-basierte Anwendungen) zu verifizieren, ist eine grundlegende Anforderung für einen autonomen Agenten und schließt eine kritische Lücke im aktuellen Prozess. Es ist eine Erweiterung der bestehenden Fähigkeiten, keine grundlegende Änderung der Architektur.

2.  **Schritt 2: Fortgeschrittenes Lernen (Implementierung von echtem RAG)**
    *   **Kategorie:** **Entscheidung über technische Richtung.**
    *   **Begründung:** Während der aktuelle "Incident-Knowledge-Loop" eine Vorstufe darstellt, erfordert die Implementierung eines vollwertigen RAG-Systems die Auswahl spezifischer Technologien (Embedding-Modelle, Vektor-Datenbanken) und einen Paradigmenwechsel von schlüsselwortbasierter zu semantischer Suche. Dies ist eine strategische Entscheidung, um die Lernfähigkeit des Systems auf eine neue Ebene zu heben.

3.  **Schritt 3: Multi-Agenten-Architektur (Vom Solo-Entwickler zum Team)**
    *   **Kategorie:** **Völlig anderer Ansatz/Architekturwechsel.**
    *   **Begründung:** Dieser Schritt verändert die interne Struktur des Agenten grundlegend von einer einzelnen entscheidungsfindenden Entität zu einem kollaborativen Team. Es ist ein großer architektonischer Wandel, der eine neue Orchestrierungslogik und Kommunikationsmechanismen erfordert, anstatt nur bestehende Fähigkeiten zu erweitern.

4.  **Schritt 4 (Zukunft): Dynamische Modellauswahl & Selbst-Reflexion**
    *   **Dynamische Modellauswahl:**
        *   **Kategorie:** **Entscheidung über technische Richtung.**
        *   **Begründung:** Dies ist eine Optimierungsstrategie, die die Effizienz und Kosten des Agenten verbessert, indem sie je nach Aufgabe das am besten geeignete Modell auswählt. Es ist eine technische Entscheidung zur Ressourcenverwaltung.
    *   **Prozess-Selbst-Reflexion:**
        *   **Kategorie:** **Völlig anderer Ansatz/Hohe Autonomie.**
        *   **Begründung:** Die Fähigkeit des Agenten, seine eigenen Kernprozesse zu analysieren und proaktiv zu verbessern, stellt eine sehr hohe Stufe der Autonomie dar und ist ein fundamentaler Wandel in der Art und Weise, wie der Agent sich selbst verwaltet.

#### 4.5.2 Parallelintegration verschiedener Ansätze für ein Gesamtsystem

Die Idee, verschiedene Ansätze parallel in ein Gesamtsystem zu integrieren und je nach Aufgabe den am besten geeigneten auszuwählen, ist äußerst sinnvoll und zukunftsweisend für autonome Agenten.

**Vorteile der Parallelintegration:**

*   **Optimale Aufgabenbearbeitung:** Unterschiedliche Aufgaben erfordern unterschiedliche Strategien. Ein einfacher Bugfix mag keine Multi-Agenten-Orchestrierung benötigen, während die Entwicklung eines komplexen Spiels davon stark profitieren könnte.
*   **Flexibilität und Robustheit:** Das System kann sich an die Komplexität und die Anforderungen der jeweiligen Aufgabe anpassen. Fällt ein Ansatz aus oder ist ineffizient, kann auf einen anderen umgeschaltet werden.
*   **Schrittweise Evolution:** Neue Architekturen können inkrementell hinzugefügt und getestet werden, ohne das gesamte System umbauen zu müssen.
*   **Lernfähigkeit auf Meta-Ebene:** Langfristig könnte der Agent selbst lernen, welcher Ansatz für welche Art von Aufgabe am effektivsten ist, und diese Auswahl autonom treffen.

**Integrationsstrategie für ein hybrides System:**

Ein solches Gesamtsystem könnte als eine Art "Meta-Agent" oder "Orchestrator" konzipiert werden, der die eingehende Benutzeranweisung analysiert und basierend auf vordefinierten Kriterien oder sogar durch ein eigenes LLM entscheidet, welche "Agenten-Persönlichkeit" oder welcher "Agenten-Modus" aktiviert werden soll:

1.  **Task-Analyse:** Der Orchestrator analysiert die Komplexität, den Umfang und die Art der Aufgabe (z.B. "Bugfix", "Feature-Implementierung", "Neues Projekt").
2.  **Modus-Auswahl:**
    *   **"Standard-Modus" (Single-Agent + Tools):** Für einfache, klar definierte Aufgaben, bei denen keine tiefgreifende Wissensintegration oder komplexe Koordination erforderlich ist.
    *   **"Lern-Modus" (Agentic RAG):** Wenn die Aufgabe potenziell von vergangenen Erfahrungen profitieren könnte oder wenn es sich um ein bekanntes Problemfeld handelt. Der RAG-Mechanismus würde proaktiv relevante Informationen abrufen und in die Planung des Single-Agenten einspeisen.
    *   **"Team-Modus" (Multi-Agenten-System):** Für große, komplexe Projekte, die eine Aufteilung in spezialisierte Rollen erfordern. Der Orchestrator würde die Manager-Rolle übernehmen und die Kommunikation zwischen den spezialisierten Agenten steuern.
3.  **Dynamische Modellauswahl:** Innerhalb jedes Modus könnte zusätzlich die dynamische Modellauswahl (Schritt 4) greifen, um die Effizienz weiter zu optimieren.

**Fazit zur Parallelintegration:**

Die Parallelintegration verschiedener Agenten-Architekturen ist nicht nur sinnvoll, sondern der logische nächste Schritt, um ein wirklich fortschrittliches und autonomes System zu schaffen. Es ermöglicht eine maßgeschneiderte Aufgabenbearbeitung, maximiert die Effizienz und legt den Grundstein für einen Agenten, der nicht nur Aufgaben löst, sondern auch seine eigene Arbeitsweise optimiert. Dieses Projekt ist ideal positioniert, um solche hybriden Ansätze zu erforschen und zu implementieren.

---

How do we know if the agent is truly *learning*? To answer this, we need a structured way to measure its performance over time and prove that the `knowledge_base` has a tangible, positive impact. Your idea of an A/B test is the perfect foundation for this.

### 5.1 The Core Methodology: Comparative A/B Testing

This approach provides empirical evidence of the learning mechanism's effectiveness.

1.  **Define a Benchmark Task:** Choose a standardized, non-trivial project that the agent has not been explicitly trained on (e.g., "Create a complete, playable Tetris game with scoring").
2.  **Establish a Control Group (Run A):** Execute the benchmark task with a "Tabula Rasa" agent. This agent's access to the `knowledge_base` is disabled. This shows its baseline performance.
3.  **Establish a Test Group (Run B):** Execute the exact same benchmark task with the standard agent that has full access to the `knowledge_base`.
4.  **Analyze and Compare:** Measure both runs using the quantitative and qualitative metrics outlined below. The difference between Run A and Run B is a direct measure of the learning's impact.

This process should be repeated periodically (e.g., after major architectural changes or significant additions to the knowledge base) to track the agent's evolution.

### 5.2 Key Evaluation Metrics

We can group metrics into four key areas to get a holistic view of the agent's performance.

| Category | Metric | Description & Measurement |
| :--- | :--- | :--- |
| **1. Efficiency & Cost** | **Time to Completion** | Total wall-clock time from start to finish. A learning agent should be faster. |
| | **Token Usage / Cost** | Total input/output tokens consumed. Fewer tokens for the same result indicates higher efficiency. |
| | **Number of Steps** | Total number of tool calls or commands executed. A more direct agent will use fewer steps. |
| **2. Quality & Correctness** | **Task Success Rate** | Binary (Yes/No): Did the agent successfully complete all requirements of the benchmark? |
| | **Code Quality Score** | Run a static analysis tool (linter) on the final code. A lower number of errors/warnings indicates higher quality. |
| | **Bug Count** | Number of bugs found during a final manual review or by running a predefined, external test suite against the finished project. |
| **3. Autonomy & Robustness** | **Error & Retry Rate** | How many times did the agent encounter an error and have to retry a step? Learning should reduce this. |
| | **Human Interventions** | How many times would a human need to intervene to correct the agent's course? (Can be simulated in review). |
| **4. Direct Learning Evidence** | **Proactive Error Avoidance** | **(Most Important)** Does the "learning" agent (Run B) proactively add tasks to its `roadmap.md` to avoid known issues from the `knowledge_base`? (e.g., adding a physics test after the Doodle Jump incident). This is direct proof of learning. |
| | **Reduced Debugging Loops** | When a known *type* of error occurs, does the learning agent solve it in fewer steps than the control agent? |

### 5.3 Practical Implementation

To implement this, we can create a `/benchmarks` directory. Each sub-directory could contain a benchmark task defined in a `prompt.txt` file. The results of each run (A and B) can be stored in separate output folders, containing the final project code, the agent's logs, and a `results.md` file summarizing the metrics.



### 5.4 Erweiterung der Autonomie: Implementierung und Evaluation neuer Agenten-Architekturen

Um die Autonomie und Intelligenz des Systems schrittweise zu steigern, können wir die im `README.md` beschriebene "Strategische Roadmap" und das "Framework for Evaluating Agent Learning" als unseren gemeinsamen Fahrplan nutzen. Hier wird beschrieben, wie wir die verschiedenen Agenten-Architekturen implementieren und bewerten können.

#### Schritt 1: Implementierung von Agentic RAG (Der lernende Agent)

Dies ist der nächste logische Schritt, um das System lernfähiger zu machen.

1.  **Setup einer Vektor-Datenbank:**
    *   Wir richten eine lokale Vektor-Datenbank ein (z.B. mit `ChromaDB` oder `FAISS`). Diese Bibliotheken lassen sich gut in Python oder Node.js integrieren.
    *   **Aktion des Agenten:** Ich kann ein Skript erstellen, das die Initialisierung und Verwaltung dieser Datenbank übernimmt.
2.  **Aufbau einer Wissens-Pipeline:**
    *   **Aktion des Agenten:** Ich werde ein Skript entwickeln, das alle `Incident Reports` (z.B. `.md`-Dateien im `knowledge_base`-Ordner) liest.
    *   **Aktion des Agenten:** Für jeden relevanten Text aus diesen Berichten werde ich ein Text-Embedding-Modell (z.B. über eine API wie `text-embedding-ada-002`) nutzen, um diesen Text in einen Vektor umzuwandeln.
    *   **Aktion des Agenten:** Diese Vektoren werden dann in der eingerichteten Vektor-Datenbank gespeichert.
3.  **Integrations-Workflow für neue Aufgaben:**
    *   **Benutzer:** Gibt eine neue Aufgabe (z.B. "Erstelle ein Tetris-Spiel").
    *   **Aktion des Agenten:** Ich formuliere eine semantische Suchanfrage basierend auf der Aufgabe (z.B. "Welche bekannten Probleme gibt es bei der Implementierung von Spielphysik und Browser-Kompatibilität?").
    *   **Aktion des Agenten:** Ich durchsuche die Vektor-Datenbank und rufe die relevantesten `Incident Reports` ab (z.B. den `INC-2025-001` aus dem Doodle-Jump-Projekt).
    *   **Aktion des Agenten:** Ich integriere das gelernte Wissen proaktiv in meine `roadmap.md`, indem ich z.B. Tasks hinzufüge wie: "Stelle sicher, dass kein Node.js-spezifischer Code im Browser verwendet wird und teste die initiale Spielbarkeit."

#### Schritt 2: Implementierung eines Multi-Agenten-Systems (Das Experten-Team)

Sobald das Agentic RAG-System etabliert ist, können wir die Architektur zu einem Multi-Agenten-System erweitern.

1.  **Rollen und Anweisungen definieren:**
    *   Wir definieren klare Rollen und spezifische Anweisungen für jeden Agenten (z.B. in separaten `.md`-Dateien wie `manager_manual.md`, `coder_manual.md`, `tester_manual.md`).
2.  **Orchestrierungs-Logik:**
    *   **Benutzer:** Gibt mir als `Manager-Agent` die Hauptaufgabe.
    *   **Aktion des Agenten (Manager-Rolle):** Ich erstelle die `roadmap.md` und zerlege die Aufgabe in kleinere Schritte.
    *   **Aktion des Agenten (Rollenwechsel):** Für jeden Task auf der Roadmap übernehme ich die entsprechende Rolle:
        *   **Als `Tester-Agent`:** Ich lese das `tester_manual.md` und schreibe zuerst einen fehlschlagenden Test.
        *   **Als `Coder-Agent`:** Ich lese das `coder_manual.md` und schreibe den Code, um den Test zu bestehen.
        *   **Als `Manager-Agent`:** Ich überprüfe das Ergebnis und fahre mit dem nächsten Task fort, koordiniere die Übergaben und stelle die Einhaltung des Gesamtplans sicher.

#### Schritt 3: Evaluierung mit dem A/B-Test-Framework

Für jede neu implementierte Architektur (Agentic RAG, Multi-Agent) führen wir den im Abschnitt "5. Measuring Success: A Framework for Evaluating Agent Learning" beschriebenen Benchmark-Test durch:

1.  **Benchmark-Aufgabe definieren:** Wir wählen eine standardisierte, nicht-triviale Aufgabe, die der Agent noch nicht bearbeitet hat (z.B. "Erstelle ein Pong-Spiel").
2.  **Kontrolllauf (A):** Ich führe die Aufgabe mit der aktuellen "Single-Agent"-Architektur (ohne RAG oder Multi-Agenten-Logik) aus.
3.  **Testlauf (B):** Ich führe dieselbe Aufgabe mit der neuen Architektur (z.B. Agentic RAG) aus.
4.  **Ergebnisse analysieren:** Ich sammle die Metriken (Zeit bis zur Fertigstellung, Token-Verbrauch, Anzahl der Schritte, Fehlerquote, proaktive Fehlervermeidung) und präsentiere dir einen detaillierten Vergleichsbericht.

Durch diesen strukturierten Prozess können wir datengestützt bewerten, welche Architektur für welche Art von Aufgabe am besten geeignet ist, und die Intelligenz dieses Systems schrittweise und messbar steigern.

---

## 6. Entwickler-Leitfaden

### 6.1 Empfohlene VS Code-Erweiterungen

1.  **Markdown All in One:** Unverzichtbar für die Bearbeitung der `.md`-Dateien des Agenten.
2.  **GitLens — Git supercharged:** Um die automatischen Commits des Agenten detailliert nachzuvollziehen.
3.  **Code Spell Checker:** Sorgt für fehlerfreie Dokumentation und Kommentare.
4.  **Prettier - Code formatter / ESLint:** Sichert konsistente Code-Formatierung in den generierten Projekten.

### 6.2 Persönliche Notizen hinzufügen

So fügen Sie eine persönliche, rote Notizbox in diesem Dokument hinzu:

1.  **Zelle zum Bearbeiten auswählen:** Klicken Sie in den Bereich, den Sie kommentieren möchten.
2.  **Vorlage kopieren:** Kopieren Sie den gesamten HTML-Code aus der Box unten.
3.  **Einfügen und Anpassen:** Fügen Sie die Vorlage ein und ersetzen Sie den Platzhaltertext.

**Vorlage zum Kopieren:**
```html
<div style="border: 2px solid #e53935; padding: 10px; background-color: #ffebee; border-radius: 5px; margin-top: 15px; margin-bottom: 15px;">
    <b style="color: #c62828;">Meine Notiz:</b>
    <p style="color: #d32f2f; margin-bottom: 0;">
        *Hier können Sie Ihre persönliche Notiz eintragen...*
    </p>
</div>
```

---

## 7. Anhang & Archiv

### 7.1 Development Log: Vampire RPG Movement

*Dieser Abschnitt beschreibt den Prozess der Implementierung und des Debuggings der Charakterbewegung im `project_vampire_rpg`.*

**1. Initial Analysis and Testing:**
Upon reviewing the code, I discovered that a foundational movement and flight system was already present in `Player.js`. My first step was to verify its functionality using automated browser tests. The initial test showed that the player did not move.

**2. Diagnosis and Debugging:**
I added `console.log()` statements to `InputController.js` and `Player.js`. By retrieving the browser's console logs (`browser_console_messages`), I discovered they were empty, proving that `keydown` events were not being registered. This led to two conclusions:
*   **Bug 1 (Root Cause):** The code was checking for simple characters (`'w'`) instead of `event.code` strings (`'KeyW'`).
*   **Bug 2 (Logic Flaw):** Movement was relative to the world's axes, not the camera's direction.

**3. Implementation of the Fix:**
*   Corrected all input checks to use `event.code` strings.
*   Refactored movement logic to be camera-relative, ensuring 'W' always moves the player away from the camera.
*   Added logic to rotate the player model to face the direction of movement.

**4. Conclusion:**
The movement system is now correctly implemented. The browser tools were invaluable for debugging by allowing me to read console logs and find the root cause.

### 7.2 Notizen aus alter README

*Dieser Abschnitt archiviert Tabellen und Notizen aus einer früheren Version dieses Dokuments.*

**Vergleich: Prozess-getriebener vs. Open-Ended Ansatz**

| Kriterium | Prozess-getriebener Ansatz (Dieses Projekt) | Open-Ended Ansatz (z.B. AutoGPT) |
| :--- | :--- | :--- |
| **Grundprinzip** | Ein rigider, vordefinierter Prozess (`agent_manual.md`) strukturiert jeden Schritt. | Der Agent entscheidet bei jedem Schritt selbst, was als Nächstes zu tun ist. |
| **Vorteile** | **Vorhersehbar, robust, hohe Qualität.** | **Flexibel, kreativ, potenziell schnellere Lösungen.** |
| **Nachteile** | **Weniger flexibel, langsamere Iteration.** | **Anfällig für Schleifen, unvorhersehbar, oft geringere Code-Qualität.** |