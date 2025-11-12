# Tutorial: XLeRobot Simulations-Demo

Dieses Tutorial führt Sie schrittweise durch den Prozess, die XLeRobot-Simulation zu starten und den Roboterarm in Aktion zu sehen.

**Voraussetzungen:**
*   CoppeliaSim Edu ist installiert.
*   Die Python-Umgebung im `sim_env`-Ordner ist eingerichtet (siehe `DEVELOPER_GUIDE.md` für Details).

---

### Schritt 1: CoppeliaSim vorbereiten

1.  **CoppeliaSim starten:** Öffnen Sie die CoppeliaSim-Anwendung.

2.  **ZMQ-Schnittstelle aktivieren:**
    *   Gehen Sie in der Menüleiste auf `Tools`.
    *   Wählen Sie `ZMQ Remote API server service`.
    *   Stellen Sie sicher, dass der Dienst läuft (ein Stopp-Symbol wird angezeigt, wenn er aktiv ist). Der Server sollte auf Port `23000` laufen.

3.  **Robotermodell importieren:**
    *   **Wichtig:** Dieser Schritt ist nur einmal notwendig. Wenn der Roboter bereits in Ihrer Szene ist, können Sie diesen Punkt überspringen.
    *   Gehen Sie in der Menüleiste auf `Module -> Importers`.
    *   Wählen Sie die `xlerobot.urdf`-Datei aus dem Verzeichnis `.../project_household_robot/simulation/xlerobot_simulation/sim_env/simulation/xlerobot_coppeliasim/` zum Import aus.
    *   Nach einem erfolgreichen Import sollte das Robotermodell in der 3D-Ansicht erscheinen.
    *   Speichern Sie die Szene als `xlerobot_demo.ttt` für zukünftige Nutzungen.

---

### Schritt 2: Die Demo-Skripte ausführen

Nachdem CoppeliaSim mit dem geladenen Roboter läuft, können Sie die Steuerungs-Skripte ausführen.

1.  **Öffnen Sie ein Terminal** (z.B. in VS Code).

2.  **Aktivieren Sie die virtuelle Umgebung:**
    ```bash
    # Navigieren Sie zum Projektordner
    cd C:\Users\lenna\Documents\AI_projects\agent_orchestration\project_household_robot\simulation\xlerobot_simulation\sim_env

    # Aktivieren der venv
    .venv\Scripts\activate
    ```

3.  **Führen Sie die Arm-Demo aus:**
    *   Geben Sie den folgenden Befehl ein, um die Demonstration der Armbewegung zu starten:
        ```bash
        python control_arm.py
        ```

---

### Was Sie sehen sollten

*   Im Terminal sehen Sie Statusmeldungen, die anzeigen, welche Bewegungssequenz gerade ausgeführt wird ("Wake Up", "Dance", etc.).
*   Im CoppeliaSim-Fenster wird der Roboterarm die im Terminal beschriebenen Bewegungen ausführen. Er wird sich aufrichten, eine "tanzende" Bewegung machen und seinen Greifer öffnen und schließen.

Herzlichen Glückwunsch! Sie haben die XLeRobot-Simulation erfolgreich ausgeführt.
