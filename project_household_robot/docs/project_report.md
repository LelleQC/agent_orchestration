# Projektbericht: XLeRobot CoppeliaSim Integration & Fehlerbehebung

Dieser Bericht dokumentiert den Prozess, die Herausforderungen und die Lösungen bei der Einrichtung und Inbetriebnahme der XLeRobot-Simulationsumgebung. Das Projekt gliederte sich in zwei Hauptphasen: den Import des Robotermodells und die Behebung eines kritischen Steuerungsproblems.

---

## Phase 1: Die Herausforderung des Modell-Imports

Das erste Ziel war, das URDF-Modell des Roboters in die CoppeliaSim-Szene zu laden, um es steuerbar zu machen. Diese scheinbar einfache Aufgabe erwies sich als komplex.

1.  **Problem - Die leere Szene:** Erste Skript-Tests (`test_move.py`) scheiterten, weil die Simulationsszene leer war. Es gab kein Objekt zum Steuern.

2.  **Fehlversuch 1: Konvertierungstools:** Der erste Lösungsansatz war die Suche nach externen Tools, um die `.urdf`-Datei in ein für CoppeliaSim natives Format (`.ttt`) zu konvertieren. Dieser Weg erwies sich als Sackgasse.

3.  **Fehlversuch 2: Manueller Mesh-Import:** Der nächste Versuch bestand darin, die einzelnen 3D-Modelle (Meshes) des Roboters manuell in die Szene zu importieren. Dies führte zwar zu einer visuellen Darstellung, aber das Modell war nur eine statische Hülle ohne Gelenke (`Joints`) und daher nicht steuerbar.

4.  **Durchbruch - Der interne URDF-Importer:** Die entscheidende Erkenntnis war, dass die Lösung nicht in externen Tools, sondern in der Anwendung selbst lag. Nach gezielter Recherche und Exploration der Anwendungsmenüs wurde ein eingebautes **URDF Importer Add-on** (`Module -> Importers`) gefunden. Die späte Entdeckung lag an mangelndem Wissen über die spezifische CoppeliaSim-Version und ihre Features. Der Import über dieses Add-on war erfolgreich und erstellte ein voll-artikuliertes, steuerbares Modell.

---

## Phase 2: Die Behebung des "Snap-Back"-Problems

Nach dem erfolgreichen Import trat sofort das nächste, schwerwiegendere Problem auf: Jeder Steuerungsbefehl wurde umgehend rückgängig gemacht.

1.  **Problem-Identifikation:** Ein an ein Gelenk gesendeter Befehl bewegte dieses nur für einen Frame, bevor es in seine Ausgangsposition "zurückschnappte".

2.  **Hypothesen & Validierung:**
    *   **Hypothese 1:** Ein interner Positions-Controller ist aktiv. **Validiert:** `check_joint_mode.py` bestätigte dies.
    *   **Hypothese 2:** Ein Skript überschreibt unsere Befehle. **Validiert:** Der Versuch, den Controller per API zu deaktivieren, schlug fehl. Ein "Brute-Force"-Skript (`oscillate_control.py`), das Befehle in einer Schleife sendete, konnte das Gelenk bewegen, was die Existenz eines konkurrierenden Skripts bewies.

3.  **Tiefenanalyse & Lösung:**
    *   Ein Log-Hinweis (`[sandboxScript:info]`) führte zur Identifizierung von `defaultMainScript.lua` als Quelle.
    *   Die Funktion **`sim.handleJointMotion()`** in diesem Skript wurde als Ursache für das Zurücksetzen der Gelenke identifiziert.
    *   Die Lösung bestand darin, diese Zeile in einer lokalen Kopie des Skripts auszukommentieren.

4.  **Technische Hürde - Schreibschutz:** Da das Originalskript nicht verändert werden konnte, wurde ein Mechanismus zur dynamischen Modifikation entwickelt (`modify_and_write_sandbox_script.py`), der CoppeliaSim anweist, zur Laufzeit die angepasste Version des Skripts zu laden.

---

## 3. Wichtigste Herausforderungen & Lösungen

| Herausforderung | Fehlgeschlagene Lösungsansätze | Erfolgreiche Lösung |
| :--- | :--- | :--- |
| **Import eines steuerbaren Modells** | 1. Externe Konvertierungstools.<br>2. Manueller Import von 3D-Meshes. | **Nutzung des internen URDF Importer Add-ons** nach gezielter Exploration der Anwendungs-GUI. |
| **"Snap-Back"-Verhalten des Roboterarms** | 1. Direkter Versuch, den Positions-Controller zu deaktivieren.<br>2. Suche nach einfachen Child-Skripten. | **Identifizierung und Deaktivierung von `sim.handleJointMotion()`** in `defaultMainScript.lua` und dynamisches Laden des modifizierten Skripts. |
| **Automatisierung von Terminal-Ausgaben** | Manuelles Kopieren und Einfügen durch den Benutzer. | *Nicht gelöst.* Die Notwendigkeit, eine Methode zum automatischen Auslesen der Konsolenausgabe zu finden, wurde als Learning für die Zukunft identifiziert. |

---

## 4. Fazit

Dieses Projekt unterstreicht zwei Kernpunkte: Erstens ist tiefgreifendes, anwendungsspezifisches Wissen (z.B. über Add-ons und interne Skripte) entscheidend für eine erfolgreiche Integration. Zweitens ist bei komplexen "Black-Box"-Systemen eine systematische, hypothesengestützte Fehlersuche, die auch kreative Workarounds zur Validierung nutzt, unerlässlich.