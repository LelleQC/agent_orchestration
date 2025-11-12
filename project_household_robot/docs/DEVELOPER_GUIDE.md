# Entwicklerhandbuch: XLeRobot Simulationsprojekt

Dieses Handbuch richtet sich an Entwickler, die das Projekt erweitern und eigenen Code zur Steuerung des Roboters schreiben möchten.

---

## 1. Code-Struktur

Alle relevanten Skripte befinden sich im Ordner `.../project_household_robot/simulation/xlerobot_simulation/sim_env/`.

*   **`control_*.py` Skripte:**
    *   Diese Skripte sind Beispiele für die Ansteuerung des Roboters.
    *   Sie nutzen die `coppeliasim-zmqremoteapi-client` Bibliothek, um eine Verbindung zum Simulator aufzubauen.
    *   Die Kernfunktionalität liegt im Abrufen eines "Handles" (einer eindeutigen ID) für ein bestimmtes Gelenk und dem anschließenden Setzen seiner Zielposition.

*   **`.venv/`:**
    *   Der Ordner für die virtuelle Python-Umgebung. Alle Abhängigkeiten sind hier installiert.
    *   **Aktivierung:** Führen Sie `.venv\Scripts\activate` im Terminal aus, bevor Sie Skripte starten.

---

## 2. Gelenke identifizieren und ansteuern

Der Schlüssel zur Steuerung des Roboters liegt im Zugriff auf seine `Joint`-Objekte.

### Schritt 1: Gelenk-Handles finden

1.  **Laden Sie das Modell in CoppeliaSim.**
2.  **Führen Sie `list_objects.py` aus.** Dieses Skript gibt eine vollständige Liste aller Objekte in der Szene aus, inklusive ihres Namens, Typs und Handles.
3.  **Suchen Sie nach Objekten vom Typ `Joint`** und notieren Sie sich den Handle des Gelenks, das Sie steuern möchten.

    *Beispiel-Output von `list_objects.py`:*
    ```
    - Name: 'Elbow', Handle: 68, Type: Joint
    - Name: 'Wrist_Roll', Handle: 70, Type: Joint
    ```

### Schritt 2: Gelenk im Code ansteuern

Verwenden Sie die folgenden `sim`-Funktionen in Ihrem Python-Skript:

*   **`sim.getJointPosition(joint_handle)`:**
    *   Gibt die aktuelle Position (Winkel in Radiant) des Gelenks zurück. Nützlich, um die Ausgangsposition zu bestimmen.

*   **`sim.setJointTargetPosition(joint_handle, target_angle_rad)`:**
    *   Setzt die Zielposition für das Gelenk. Die interne Physik-Engine von CoppeliaSim bewegt das Gelenk dann in Richtung dieser Position.
    *   `target_angle_rad` muss in Radiant angegeben werden.

*Beispiel-Code zum Bewegen des Handgelenks (`Wrist_Roll`):*
```python
import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

# Verbindung herstellen
client = RemoteAPIClient()
sim = client.getObject('sim')

# Handle für das Handgelenk (aus list_objects.py entnommen)
wrist_roll_handle = 70

# Aktuelle Position auslesen
current_pos = sim.getJointPosition(wrist_roll_handle)
print(f"Aktuelle Position des Handgelenks: {current_pos:.2f} rad")

# Handgelenk um 90 Grad (pi/2 Radiant) drehen
print("Drehe Handgelenk...")
sim.setJointTargetPosition(wrist_roll_handle, current_pos + 1.57)
time.sleep(2) # Zeit geben für die Bewegung

# Zurück zur Ausgangsposition
print("Drehe zurück...")
sim.setJointTargetPosition(wrist_roll_handle, current_pos)
time.sleep(2)

print("Skript beendet.")
```

---

## 3. Wichtige Hinweise

*   **Radiant vs. Grad:** Alle Winkel für Gelenkpositionen müssen in **Radiant** angegeben werden.
*   **`time.sleep()`:** Geben Sie der Simulation nach dem Senden eines Bewegungsbefehls immer etwas Zeit, die Bewegung auch auszuführen. Ohne eine Pause (`time.sleep()`) würden Befehle zu schnell aufeinander folgen und die Bewegungen wären nicht sichtbar.
*   **Fehlersuche:** Wenn ein Skript fehlschlägt, überprüfen Sie Folgendes:
    1.  Ist CoppeliaSim geöffnet und die Simulation gestartet?
    2.  Ist der ZMQ Remote API Server aktiv?
    3.  Ist das Robotermodell korrekt in der Szene geladen?
    4.  Stimmt der `joint_handle` im Skript mit dem in der aktuellen Szene überein? (Überprüfen mit `list_objects.py`)
