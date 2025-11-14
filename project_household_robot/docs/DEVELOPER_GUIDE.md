# Entwicklerhandbuch: XLeRobot Simulationsprojekt

Dieses Handbuch richtet sich an Entwickler, die das Projekt erweitern und eigenen Code zur Steuerung des Roboters schreiben möchten.

---

## 1. Code-Struktur

Alle relevanten Skripte befinden sich im Ordner `.../project_household_robot/simulation/xlerobot_simulation/sim_env/`.

*   **`control_*.py` Skripte:**
    *   `control_arm.py`: Demonstriert die Steuerung des gesamten Roboterarms.
    *   `control_base.py`: Demonstriert die Steuerung der mobilen Basis des Roboters.
    *   Diese Skripte sind die primären Beispiele für die Ansteuerung des Roboters.

*   **`modify_and_write_sandbox_script.py` / `revert_sandbox_script.py`:**
    *   Wichtige Utility-Skripte zur Handhabung des "Snap-Back"-Problems. Siehe Abschnitt 4 für Details.

*   **`defaultMainScript.lua`:**
    *   Eine modifizierte Version des Haupt-Simulationsskripts von CoppeliaSim. Die Zeile `sim.handleJointMotion()` ist hier auskommentiert, um das "Snap-Back"-Problem zu verhindern.

*   **`.venv/`:**
    *   Der Ordner für die virtuelle Python-Umgebung.
    *   **Aktivierung:** Führen Sie `.venv\Scripts\activate` im Terminal aus, bevor Sie Skripte starten.

---

## 2. Gelenke identifizieren und ansteuern

Der Schlüssel zur Steuerung des Roboters liegt im Zugriff auf seine `Joint`-Objekte.

### Schritt 1: Gelenk-Handles finden

1.  **Laden Sie das Modell in CoppeliaSim.**
2.  **Führen Sie `list_objects.py` aus.** Dieses Skript gibt eine vollständige Liste aller Objekte in der Szene aus.
3.  **Suchen Sie nach Objekten vom Typ `Joint`** und notieren Sie sich den Handle des Gelenks, das Sie steuern möchten.

### Schritt 2: Gelenk im Code ansteuern

Verwenden Sie die folgenden `sim`-Funktionen in Ihrem Python-Skript:

*   **`sim.setObjectInt32Parameter(joint_handle, sim.jointintparam_ctrl_enabled, 0)`:**
    *   **ESSENTIELL:** Deaktiviert den internen Positions-Controller des Gelenks. Ohne diesen Aufruf wird das Gelenk immer wieder in seine Ausgangsposition zurückspringen.

*   **`sim.setJointMaxForce(joint_handle, force)`:**
    *   Gibt dem Gelenk die nötige Kraft, um sich zu bewegen. Ein Wert von `100` ist in der Regel ausreichend.

*   **`sim.setJointTargetPosition(joint_handle, target_angle_rad)`:**
    *   Setzt die Zielposition für ein Gelenk (z.B. im Arm).

*   **`sim.setJointTargetVelocity(joint_handle, target_velocity_rad_s)`:**
    *   Setzt die Zielgeschwindigkeit für ein Gelenk (z.B. für die Räder der Basis).

*Beispiel-Code zum Bewegen des Ellbogens:*
```python
import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

client = RemoteAPIClient()
sim = client.getObject('sim')

elbow_handle = 82 # Aus list_objects.py entnommen

# 1. Controller deaktivieren
sim.setObjectInt32Parameter(elbow_handle, sim.jointintparam_ctrl_enabled, 0)

# 2. Kraft setzen
sim.setJointMaxForce(elbow_handle, 100)

# 3. Zielposition setzen
sim.setJointTargetPosition(elbow_handle, 1.0) # Bewege zu 1.0 Radiant
time.sleep(2) # Zeit für die Bewegung geben

sim.setJointTargetPosition(elbow_handle, 0.0) # Zurück zur Ausgangsposition
time.sleep(2)

print("Skript beendet.")
```

---

## 3. Wichtige Hinweise

*   **Radiant vs. Grad:** Alle Winkel müssen in **Radiant** angegeben werden.
*   **`time.sleep()`:** Geben Sie der Simulation nach einem Befehl immer Zeit, die Bewegung auszuführen.

---

## 4. Umgang mit dem "Snap-Back"-Problem und Schreibschutz

Das Kernproblem dieses Projekts war ein "Snap-Back"-Effekt, der durch das Hauptskript von CoppeliaSim (`defaultMainScript.lua`) verursacht wurde. Da dieses Skript im schreibgeschützten Installationsverzeichnis liegt, wurde eine dynamische Lösung entwickelt.

*   **Problem:** `defaultMainScript.lua` ruft `sim.handleJointMotion()` auf und überschreibt damit unsere externen Befehle.
*   **Lösung:** Wir weisen CoppeliaSim an, zur Laufzeit eine modifizierte Version dieses Skripts zu verwenden.

### Workflow:

1.  **`modify_and_write_sandbox_script.py`:**
    *   Dieses Skript muss **einmal pro Sitzung** nach dem Start von CoppeliaSim ausgeführt werden.
    *   Es modifiziert das `sandboxScript`-System von CoppeliaSim im Speicher, sodass es unsere lokale, angepasste `defaultMainScript.lua` (in der die problematische Zeile auskommentiert ist) verwendet.

2.  **`revert_sandbox_script.py`:**
    *   Dieses Skript kann ausgeführt werden, um die Änderungen rückgängig zu machen und das Standardverhalten von CoppeliaSim wiederherzustellen, ohne die Anwendung neu starten zu müssen.

**Für Entwickler bedeutet das:** Wenn Sie das "Snap-Back"-Verhalten nach einem Neustart von CoppeliaSim wieder bemerken, führen Sie einfach `python modify_and_write_sandbox_script.py` erneut aus.