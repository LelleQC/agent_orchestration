# Agent Orchestration: Ein autonomes, lernendes Agenten-System

Willkommen beim Agent Orchestration Projekt! Dieses Repository beherbergt ein autonomes Agenten-System, das darauf ausgelegt ist, komplexe Software-Entwicklungsaufgaben selbstständig zu meistern. Es ist sowohl das Gehirn des Agenten als auch das primäre Projekt, das er weiterentwickelt.

## Was ist dieses Projekt?

Dieses Projekt ist ein **prozessgesteuerter, autonomer Einzelagent**. Seine Architektur ist deterministisch und baut auf einem zentralen `agent_manual.md` auf, das als sein operatives Betriebssystem fungiert. Der Agent ist darauf ausgelegt, die komplexe Aufgabe der Softwareentwicklung in ein schrittweises, wiederholbares und nachvollziehbares Verfahren zu zerlegen.

Er kann den gesamten Entwicklungs-Lebenszyklus autonom managen – von der Planung über das Testen bis zur Dokumentation und Versionierung.

## Die Vision: Was soll es werden?

Das Projekt verfolgt zwei miteinander verbundene Hauptziele:

1.  **Funktionale Autonomie:** Die Entwicklung eines Agenten, der komplexe, abstrakt definierte Aufgaben (z.B. "Erstelle ein Spiel") selbstständig in konkrete Schritte zerlegen, ausführen, testen und dokumentieren kann.
2.  **Evolutionäre Kompetenz (Lernfähigkeit):** Die Schaffung eines Systems, das mit jeder Aufgabe und jedem Fehler lernt und seine Fähigkeiten verbessert. Langfristig soll so ein immer fähigerer und robusterer autonomer Entwickler entstehen.

## Kernarchitektur

Die Architektur des Systems basiert auf vier Säulen:

*   **Arbeitsablauf (`agent_manual.md`):** Das Herzstück des Agentenverhaltens. Es schreibt einen strengen, testgetriebenen Entwicklungszyklus (TDD) vor und stellt sicher, dass die Ergebnisse überprüfbar und von hoher Qualität sind.
*   **Versionierung:** Ein einfaches System (`VERSION` und `.agent_version` Dateien) stellt die Nachvollziehbarkeit sicher, nach welchem "Rezept" ein Projekt erstellt wurde.
*   **Automatisierter Git-Workflow:** Jedes fertiggestellte Feature wird automatisch als atomarer, lokaler Commit gespeichert. Dies sorgt für eine saubere, nachvollziehbare Git-Historie.
*   **Lernmechanismus (Incident-Knowledge-Loop):** Ein strukturierter Wissenskreislauf, der es dem Agenten ermöglicht, aus Fehlern zu lernen und dieses Wissen proaktiv für zukünftige Projekte zu nutzen.

```
      +------------------+       +----------------------+       +---------------------+
      |   Neues Projekt  |------>| Konsultiere Wissens- |------>|   Proaktive Planung |
      |  (z.B. Spiel B)  |       |       datenbank      |       | (z.B. Test für Physik)|
      +------------------+       +----------+-----------+       +----------+----------+
                                            ^                         |
                                            | LERNEN                  | AUSFÜHRUNG
                                            |                         v
      +------------------+       +----------+-----------+       +----------+----------+
      | Incident Report  |<------|   Generalisiere zu   |<------|      Fehler in      |
      | (in /knowledge_base) |       |      Prinzip         |       |    Spiel A gefunden   |
      +------------------+       +----------------------+       +---------------------+
```

## Stärken und Schwächen

| Stärken (Pros) | Schwächen (Cons) |
| :--- | :--- |
| **Struktur und Vorhersehbarkeit:** Der starre Rahmen sorgt für einen disziplinierten Prozess. | **Reaktivität und "Blindheit":** Der Agent kann seine Arbeit nicht selbst "sehen" oder "ausprobieren". |
| **Qualitätssicherung durch TDD:** Der testgetriebene Ansatz sichert die logische Korrektheit. | **Starrer Prozess:** Ineffizienzen im `agent_manual.md` werden wiederholt. |
| **Grundstein für Lernen:** Der 'Incident-Knowledge-Loop' ist eine robuste Grundlage für RAG. | **Begrenzte Wissensanwendung:** Die simple Keyword-Suche schränkt das Lernen ein. |
| **Saubere Git-Historie:** Automatische, atomare Commits schaffen eine mustergültige Versionsgeschichte. | **Begrenzte Test-Tiefe:** TDD sichert Logik, aber keine User Experience (UX) oder visuelle Aspekte. |

## Roadmap: Der Weg zu größerer Autonomie

Basierend auf den aktuellen Schwächen sind folgende Entwicklungs-Epics geplant:

1.  **Epic 1: Proaktive Verifikation & Selbst-Korrektur:** Der Agent soll die Fähigkeit erlangen, seine eigene Arbeit grundlegend zu überprüfen (z.B. durch Headless-Browser-Tests) und einfache Fehler selbstständig zu erkennen.
2.  **Epic 2: Implementierung eines echten RAG-Systems:** Ersetzen der Keyword-Suche durch eine semantische Suche (via Vektor-Datenbank), um die Relevanz der abgerufenen Informationen drastisch zu erhöhen.
3.  **Epic 3: Multi-Agenten-Architektur (Spezialisierung):** Übergang von einem "Generalisten"-Agenten zu einem Team von spezialisierten Agenten (z.B. Projekt-Manager, Entwickler, QA), um die Komplexität besser zu bewältigen.

## Einordnung in die KI-Landschaft

Dieses Projekt positioniert sich bewusst als **prozess-getriebener Agent** im Gegensatz zu Open-Ended Ansätzen wie AutoGPT.

| Kriterium | Prozess-getriebener Ansatz (Dieses Projekt) | Open-Ended Ansatz (z.B. AutoGPT) |
| :--- | :--- | :--- |
| **Grundprinzip** | Ein rigider, vordefinierter Prozess (`agent_manual.md`) strukturiert jeden Schritt. | Der Agent entscheidet bei jedem Schritt selbst, was als Nächstes zu tun ist. |
| **Vorteile** | **Vorhersehbar, robust, hohe Qualität.** | **Flexibel, kreativ, potenziell schnellere Lösungen.** |
| **Nachteile** | **Weniger flexibel, langsamere Iteration.** | **Anfällig für Schleifen, unvorhersehbar, oft geringere Code-Qualität.** |

**Strategische Schlussfolgerung:** Unser Ziel ist nicht, den kreativsten oder schnellsten Agenten zu bauen, sondern den **zuverlässigsten und diszipliniertesten**. Wir sehen den `agent_manual.md` nicht als Krücke, sondern als das zentrale Asset, das wir schrittweise durch intelligentere, gelernte Fähigkeiten ersetzen.
