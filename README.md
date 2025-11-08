## Anleitung: Persönliche Notizen in VS Code hinzufügen

Dieses Dokument besteht aus vielen kleinen Abschnitten (Zellen), damit Sie Ihre Notizen präzise an der richtigen Stelle einfügen können. So fügen Sie eine persönliche, rote Notizbox hinzu:

1.  **Zelle zum Bearbeiten auswählen:** Klicken Sie in den Bereich des Textes, den Sie kommentieren möchten. Die Zelle wechselt daraufhin in den Bearbeitungsmodus (ein Rahmen erscheint).
2.  **Vorlage kopieren:** Kopieren Sie den gesamten HTML-Code aus der grauen Box unten.
3.  **Einfügen und Anpassen:** Fügen Sie die kopierte Vorlage an der gewünschten Stelle im Text ein. Ersetzen Sie den Platzhalter `*Hier können Sie Ihre persönliche Notiz eintragen...*` mit Ihrem Text.
4.  **Anzeige überprüfen:** Klicken Sie außerhalb der Zelle oder drücken Sie `Esc`, um den Bearbeitungsmodus zu verlassen. Die Notizbox wird nun rot und deutlich sichtbar angezeigt.

---
### Vorlage zum Kopieren:

```html
<div style="border: 2px solid #e53935; padding: 10px; background-color: #ffebee; border-radius: 5px; margin-top: 15px; margin-bottom: 15px;">
    <b style="color: #c62828;">Meine Notiz:</b>
    <p style="color: #d32f2f; margin-bottom: 0;">
        *Hier können Sie Ihre persönliche Notiz eintragen...*
    </p>
</div>
```
---
# Dokumentation: Autonomes Agenten-System

**Version: 1.0.0**

Dieses Dokument beschreibt die Architektur, die Ziele und den Entwicklungspfad des autonomen Agenten-Systems. Es dient als zentrale Anlaufstelle, um das aktuelle System zu verstehen und die zukünftige Entwicklung zu planen.
## 1. Projektziele

Das Projekt verfolgt zwei miteinander verbundene Hauptziele:

1.  **Funktionale Autonomie:** Das primäre Ziel ist die Entwicklung eines Agenten, der komplexe, abstrakt definierte Aufgaben (z.B. "Erstelle ein Spiel", "Schreibe eine API") selbstständig in konkrete Schritte zerlegen, ausführen, testen und dokumentieren kann. Der Agent operiert dabei ausschließlich über die Kommandozeile und nutzt die zur Verfügung gestellten Werkzeuge.

2.  **Evolutionäre Kompetenz (Lernfähigkeit):** Das übergeordnete, strategische Ziel ist, dass das System nicht statisch bleibt, sondern mit jeder Aufgabe und jedem Fehler lernt und seine Fähigkeiten verbessert. Das System soll eine Form von "Gedächtnis" entwickeln, das es ihm erlaubt, vergangene Fehler in Zukunft zu vermeiden und Best Practices über Projektgrenzen hinweg zu generalisieren. Langfristig soll so ein immer fähigerer und robusterer autonomer Entwickler entstehen.
## 2. Kernarchitektur

Die Architektur des Systems basiert auf vier Säulen: einem definierten Arbeitsablauf, klarer Versionierung, einem automatisierten Git-Workflow und einem strukturierten Lernmechanismus.
### 2.1 Arbeitsablauf: `agent_manual.md`

Das Herzstück des Agentenverhaltens ist im `agent_manual.md` definiert. Es schreibt einen strengen, testgetriebenen Entwicklungszyklus (Test-Driven Development, TDD) vor:

1.  **Planung:** Analyse der Aufgabe, Konsultation der Wissensdatenbank und Erstellung einer `roadmap.md` mit allen Features.
2.  **Testen:** Für jedes Feature wird zuerst ein Test geschrieben, der fehlschlägt.
3.  **Implementierung:** Es wird der minimal nötige Code geschrieben, damit der Test erfolgreich ist.
4.  **Refactoring:** Der Code wird verbessert und aufgeräumt.
5.  **Commit:** Die Änderung wird automatisch als Git-Commit gespeichert.
6.  **Dokumentation:** Nach Abschluss aller Features werden die finalen Dokumente (`README.md`, `TUTORIAL.md` etc.) erstellt.

Dieser Zyklus stellt sicher, dass die Ergebnisse überprüfbar und von hoher Qualität sind.
### 2.2 Versionierung

Um die Entwicklung des Agenten-Systems selbst nachvollziehbar zu machen, wurde ein einfaches Versionierungssystem eingeführt:

-   **`VERSION`:** Eine Datei im Hauptverzeichnis, die die aktuelle Version des Gesamtsystems nach [Semantischer Versionierung](https://semver.org/lang/de/) (z.B. `1.0.0`) enthält. `MAJOR`-Änderungen für inkompatible Prozessänderungen, `MINOR` für neue Features (wie die Wissensdatenbank) und `PATCH` für Bugfixes.
-   **`.agent_version`:** Bei der Erstellung eines Projekts wird die aktuelle Systemversion aus der `VERSION`-Datei gelesen und in eine `.agent_version`-Datei innerhalb des Projektordners geschrieben. Dies ermöglicht eine exakte Zuordnung, nach welchem "Rezept" ein Projekt erstellt wurde.
### 2.3 Git-Workflow: Automatische Feature-Commits

Das gesamte Projekt steht unter Git-Versionskontrolle. Der Arbeitsablauf ist so gestaltet, dass er für dich so einfach wie möglich ist:

1.  **Der Agent committet:** Jedes Mal, wenn der Agent ein Feature aus der `roadmap.md` fertigstellt, erstellt er automatisch einen atomaren, lokalen Commit. Die Commit-Nachricht beschreibt das umgesetzte Feature.
2.  **Du pushst:** Deine einzige Aufgabe ist es, `git push` auszuführen, wann immer du die vom Agenten erstellten Commits auf dein GitHub-Repository hochladen möchtest.

Dieses Vorgehen stellt eine saubere, nachvollziehbare und feature-basierte Git-Historie sicher, ohne dass du dich um das manuelle Committen kümmern musst.
### 2.4 Der Lernmechanismus: Incident-Knowledge-Loop

Dies ist die wichtigste Neuerung in Version 1.0.0 und der erste Schritt zu einem intelligenten, lernfähigen System. Es löst das Problem, dass der Agent Fehler zwar reaktiv behebt, aber nicht proaktiv aus ihnen lernt.

**Das Problem:** Ohne ein Gedächtnis würde der Agent ähnliche Fehler (z.B. grundlegende Physik-Fehler in Spielen) immer wieder machen.

**Die Lösung:** Ein strukturierter Wissenskreislauf.

```
      +------------------+       +----------------------+       +---------------------+
      |   Neues Projekt  |------>| Konsultiere Wissens- |------>|   Proaktive Planung |
      |      (z.B. Spiel B)  |       |       datenbank      |       | (z.B. Test für Physik)|
      +------------------+       +----------+-----------+       +----------+----------+
                                            ^                         |
                                            | LERNEN                  | AUSFÜHRUNG
                                            |                         v
      +------------------+       +----------+-----------+       +----------+----------+
      | Incident Report  |<------|   Generalisiere zu   |<------|      Fehler in      |
      | (in /knowledge_base) |       |      Prinzip         |       |    Spiel A gefunden   |
      +------------------+       +----------------------+       +---------------------+
```

**So funktioniert der Kreislauf:**

1.  **Fehlerbehebung & Analyse:** Wenn ein Fehler auftritt und behoben wird (wie beim `Doodle Jump`-Projekt), erstellt der Agent einen **`Incident Report`** in Form einer Markdown-Datei im `/knowledge_base`-Ordner.
2.  **Strukturierte Erfassung:** Jeder Report hat eine feste Struktur (Symptom, Ursache, Lösung, spezifisches Learning und – am wichtigsten – ein **generalisiertes Prinzip**).
3.  **Wissensanwendung:** Wenn der Agent ein **neues** Projekt startet, durchsucht er die `knowledge_base` nach relevanten `GeneralizedPrinciple`-Einträgen. 
4.  **Proaktive Planung:** Die gefundenen Prinzipien werden zu konkreten, verpflichtenden Aufgaben in der `roadmap.md` des neuen Projekts. So wird aus dem reaktiven Fix für *Spiel A* eine proaktive Test-Anforderung für *Spiel B*.

**Der Weg zu RAG (Retrieval-Augmented Generation):**
Dieses System ist die Vorstufe zu einem echten RAG-System. Aktuell basiert die Suche auf einfachen Keywords. Der nächste logische Schritt ist, die `Incident Reports` in einem Vektor-Index zu speichern und eine semantische Suche zu implementieren. Dadurch kann der Agent Zusammenhänge zwischen Problemen erkennen, die auf reiner Keyword-Ebene nicht sichtbar wären.
## 3. Analyse der aktuellen Schwächen

Eine ehrliche Analyse zeigt folgende Limitationen des aktuellen Systems (Version 1.0.0):

1.  **Reaktive Fehlererkennung:** Der Agent ist darauf angewiesen, dass ein Mensch einen Fehler meldet. Er besitzt keine eigene Fähigkeit zur Verifikation, ob ein Projekt (z.B. ein Spiel) tatsächlich funktioniert oder nur syntaktisch korrekten Code darstellt. Er kann nicht "sehen" oder "ausprobieren".

2.  **Rudimentäre Wissens-Suche:** Die aktuelle Suche in der Wissensdatenbank ist sehr einfach (Keyword-basiert). Sie kann keine konzeptionellen Ähnlichkeiten zwischen Problemen erkennen, wenn die Schlagwörter nicht übereinstimmen.

3.  **Begrenzte Test-Tiefe:** Test-Driven Development (TDD) ist exzellent für die Logik, aber unzureichend für Aspekte der User Experience (UX) oder des visuellen Designs. Ein Test kann prüfen, ob ein Sprung-Wert korrekt berechnet wird, aber nicht, ob sich der Sprung für den Spieler "gut anfühlt" oder ob die Grafiken korrekt angezeigt werden.

4.  **Fehlende Selbst-Reflexion über den Prozess:** Der Agent folgt dem `agent_manual.md` starr. Wenn der Prozess selbst fehlerhaft oder ineffizient ist, hat der Agent keine Metrik oder Fähigkeit, dies zu erkennen und eine Verbesserung des Manuals vorzuschlagen.
## 4. Ausblick: Der Pfad zu größerer Autonomie

Basierend auf den aktuellen Schwächen und dem Stand der Forschung im Bereich autonomer Agenten, schlage ich folgende Entwicklungsrichtungen vor, um die nächste Stufe der Autonomie zu erreichen:
### 4.1 Schritt 1: Proaktive Verifikation & Selbst-Korrektur

Das System muss lernen, seine eigene Arbeit zu überprüfen. Dies kann durch einen neuen Schritt am Ende des Entwicklungszyklus geschehen: die **Verifikations-Phase**.

-   **Headless Browser-Tests:** Für Web-Projekte kann der Agent einen Headless Browser (z.B. via Playwright oder Puppeteer) starten, die Seite laden und auf Konsole-Fehler prüfen. Er könnte sogar einfache Interaktionen simulieren (z.B. einen Button klicken).
-   **Visuelle Verifikation (VLM):** Zukünftig könnte der Agent Screenshots seiner erstellten Anwendung an ein multimodales Modell (Visual Language Model, VLM) senden und Fragen stellen wie: "Sieht diese Seite kaputt aus?" oder "Wird das Spiel korrekt gerendert?" Dies wäre ein Quantensprung von der Code-Prüfung zur echten Ergebnis-Prüfung.

Wenn in dieser Phase ein Fehler entdeckt wird, startet der Agent selbstständig einen neuen `Incident-Knowledge-Loop`, ohne auf menschliches Feedback angewiesen zu sein.
### 4.2 Schritt 2: Implementierung eines echten RAG-Systems

Die aktuelle Wissensdatenbank muss zu einem echten RAG-System ausgebaut werden:

1.  **Embedding:** Jeder `Incident Report` wird beim Speichern durch ein Text-Embedding-Modell in einen Vektor umgewandelt.
2.  **Vektor-Datenbank:** Diese Vektoren werden in einer spezialisierten Vektor-Datenbank (z.B. ChromaDB, FAISS, Pinecone) gespeichert.
3.  **Semantische Suche:** Bei der Planung eines neuen Projekts formuliert der Agent eine semantische Anfrage (z.B. "Wie stelle ich sicher, dass die grundlegende Spielmechanik funktioniert?") und erhält die relevantesten vergangenen Lektionen zurück, auch wenn die Keywords nicht exakt passen.
### 4.3 Schritt 3: Multi-Agenten-Architektur (Spezialisierung)

Statt eines einzigen Agenten, der alles macht, könnte das System in spezialisierte Rollen aufgeteilt werden, die zusammenarbeiten. Dies spiegelt menschliche Software-Teams wider und ist ein aktives Forschungsfeld (z.B. MetaGPT, ChatDev).

-   **`Projekt-Manager-Agent`:** Zerlegt die Hauptaufgabe und pflegt die `roadmap.md`.
### 4.4 Bewertung und Einordnung des Systems

Eine abschließende Bewertung des aktuellen Systems im Kontext der Projektziele und im Vergleich zu bestehenden Ansätzen.

**Systembeschreibung und Architektur**

Das aktuelle System ist ein prozessgesteuerter, autonomer Einzelagent. Seine Architektur ist deterministisch und baut auf dem `agent_manual.md` auf, das als sein operatives Betriebssystem fungiert. Der Lernprozess wird durch einen einfachen 'Incident-to-Knowledge'-Kreislauf initiiert, der jedoch auf externem Feedback beruht. Es ist im Kern ein System, das darauf ausgelegt ist, die komplexe Aufgabe der Softwareentwicklung in ein schrittweises, wiederholbares und nachvollziehbares Verfahren zu zerlegen.

**Vorteile (Pros)**

- **Struktur und Vorhersehbarkeit:** Der starre Rahmen des `agent_manual.md` sorgt für einen extrem disziplinierten und nachvollziehbaren Entwicklungsprozess.
- **Qualitätssicherung durch TDD:** Der testgetriebene Ansatz stellt die logische Korrektheit jedes implementierten Features sicher.
- **Grundstein für Lernen:** Der 'Incident-Knowledge-Loop' ist, obwohl rudimentär, eine robuste Grundlage für zukünftige, intelligentere Lernmechanismen wie RAG.
- **Saubere Git-Historie:** Die automatischen, atomaren Commits pro Feature schaffen eine mustergültige und leicht verständliche Versionsgeschichte.

**Nachteile (Cons)**

- **Reaktivität und 'Blindheit':** Der Agent kann die von ihm erstellten Anwendungen nicht selbstständig 'sehen' oder 'benutzen'. Er ist auf menschliches Feedback zur Fehlererkennung angewiesen.
- **Starrer Prozess:** Der Agent kann seinen eigenen Arbeitsablauf nicht hinterfragen oder optimieren. Ineffizienzen im `agent_manual.md` werden endlos wiederholt.
- **Begrenzte Wissensanwendung:** Die simple, keyword-basierte Suche schränkt die Fähigkeit des Agenten, aus vergangenen Erfahrungen zu lernen, stark ein.

**Vergleich mit alternativen Ansätzen**

- **Menschliche Entwickler:** Der größte Unterschied liegt in der fehlenden Intuition, Kreativität und dem echten Verständnis für das Problem. Der Agent 'versteht' nicht, was er baut; er folgt einem Prozess.
- **Open-Ended Agents (z.B. AutoGPT):** Im Gegensatz zu diesen oft unstrukturierten und unvorhersehbaren Agenten, die in Schleifen geraten können, erzwingt dieses System einen disziplinierten Engineering-Ansatz. Das Ziel ist nicht nur, eine Lösung zu finden, sondern sie auf eine robuste und nachvollziehbare Weise zu konstruieren.
- **Code-Assistenten (z.B. Copilot):** Während Copilot ein Werkzeug zur Code-Vervollständigung ist, das dem menschlichen Entwickler assistiert, zielt dieses System darauf ab, den gesamten Entwicklungs-Lebenszyklus autonom zu managen – von der Planung über das Testen bis zur Dokumentation.

**Einordnung in das Gesamtziel des 'Self-Learning'**

Das aktuelle System ist ein bewusst gewählter erster Schritt auf dem Weg zu einem sich selbst verbessernden KI-Entwickler. Die rigide Struktur des `agent_manual.md` ist ein notwendiges 'Gerüst', um die enorme Komplexität der Softwareentwicklung handhabbar zu machen. Es dient dazu, den unterkomplexen Kontext, den ein LLM von Natur aus hat, zu strukturieren und zu erweitern.

Die Strategie ist, dieses Gerüst schrittweise abzubauen und durch intelligentere, gelernte Fähigkeiten zu ersetzen. Jeder Entwicklungsschritt (wie die Implementierung von RAG oder die Einführung von Selbst-Verifikation) zielt darauf ab, eine Regel aus dem Handbuch durch einen autonomen Entscheidungsprozess zu ersetzen. Das System ist so konzipiert, dass es seine eigene Intelligenz 'bootstrapped' – es nutzt eine starre Struktur, um die Fähigkeiten zu entwickeln, die es eines Tages befähigen werden, ohne diese Struktur zu operieren.
## 5. Zukünftige Optimierung: Dynamische Modellauswahl

Eine weitere wichtige Dimension zur Optimierung des Agenten ist die intelligente Nutzung der verfügbaren KI-Modelle. Nicht jede Aufgabe erfordert das leistungsstärkste und teuerste Modell. Eine dynamische Modellauswahl kann die Effizienz und Wirtschaftlichkeit des Systems drastisch erhöhen.

**Konzept: Aufgabenbasierte Modellzuweisung**

Die Idee ist, den Agenten so zu gestalten, dass er je nach Art der Aufgabe das am besten geeignete Modell auswählt:

- **Kostengünstige, schnelle Modelle (z.B. Gemini Flash):** Diese Modelle eignen sich hervorragend für Routineaufgaben, die ein großes Kontextverständnis erfordern, aber weniger komplexe Schlussfolgerungen benötigen. Beispiele:
    - **Code-Formatierung und Refactoring:** Anwenden von Stilrichtlinien auf große Codebasen.
    - **Zusammenfassungen erstellen:** Generieren von `README.md` oder anderen Dokumenten aus dem Code.
    - **Einfache Code-Transformationen:** Umschreiben von Code nach einem klaren Muster.

- **Leistungsstarke, teurere Modelle (z.B. Gemini Pro):** Diese Modelle sollten für die kritischsten und komplexesten Aufgaben reserviert werden, bei denen tiefes 'Nachdenken' und logisches Schließen erforderlich sind. Beispiele:
    - **Initialplanung und Architektur:** Die erste Zerlegung eines abstrakten Ziels in eine `roadmap.md`.
    - **Fehleranalyse und Debugging:** Die Analyse eines komplexen Fehlers und die Formulierung einer Hypothese zur Ursache.
    - **Algorithmen-Design:** Das Schreiben von Kernlogik, die komplexen Anforderungen genügen muss.

**Implementierungsansatz**

Die Implementierung könnte über eine vorgeschaltete 'Router'- oder 'Dispatcher'-Logik erfolgen. Bevor der Agent eine Aufgabe ausführt, klassifiziert er sie anhand von Metadaten (z.B. Tags in der `roadmap.md` wie `[LOGIC]`, `[DOCS]`) und leitet die Anfrage an die entsprechende Modell-API weiter.

**Voraussetzung:** Dies setzt voraus, dass die verwendete Inferenz-API (z.B. die Gemini-API) den programmatischen Wechsel des Modells für einen Aufruf erlaubt. Dies müsste im Detail geprüft werden. Sollte dies möglich sein, könnte der Agent seinen Token-Verbrauch pro Tag optimieren und die leistungsstarken Modelle gezielt dort einsetzen, wo sie den größten Mehrwert bringen.