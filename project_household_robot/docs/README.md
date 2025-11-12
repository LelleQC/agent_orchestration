# Technisches Handbuch: XLeRobot CoppeliaSim Integration

## 1. Projektübersicht

Dieses Projekt realisiert eine Simulationsumgebung für den XLeRobot in CoppeliaSim. Die Steuerung des Roboters erfolgt über Python-Skripte, die mittels der ZMQ Remote API mit dem Simulator kommunizieren.

**Projektstatus:** Erfolgreich abgeschlossen.

Das primäre Ziel, ein voll-artikuliertes Robotermodell in die Simulation zu laden und dessen Gelenke per Python zu steuern, wurde erreicht.

---

## 2. Technische Architektur

Die Architektur besteht aus zwei Hauptkomponenten:

1.  **CoppeliaSim:** Die Simulationsumgebung, die die Physik und die Visualisierung des Roboters übernimmt.
    *   **Robotermodell:** Das Gelenk-Modell des Roboters wurde durch den Import der `xlerobot.urdf`-Datei in die Szene geladen. Dies war nur möglich nach der manuellen Aktivierung des **URDF Importer Add-ons** in CoppeliaSim.
    *   **Schnittstelle:** Die Kommunikation erfolgt über den ZMQ Remote API Server, der in CoppeliaSim auf Port `23000` läuft.

2.  **Python-Steuerungsskripte:** Ein Satz von Python-Skripten, die außerhalb von CoppeliaSim ausgeführt werden, um den Roboter zu steuern.
    *   **Verbindung:** Die `coppeliasim-zmqremoteapi-client` Bibliothek wird verwendet, um eine Verbindung zum Simulator herzustellen.
    *   **Steuerung:** Die Skripte greifen auf die `Joint`-Objekte des Roboters in der Simulation zu, um deren Zielpositionen zu setzen und so Bewegungen auszulösen.

---

## 3. Wichtige Skripte

Der `sim_env`-Ordner enthält die wesentlichen Skripte für dieses Projekt:

*   `list_objects.py`: Ein Diagnose-Skript, das alle Objekte in der CoppeliaSim-Szene auflistet und deren Typ (z.B. `Shape`, `Joint`) anzeigt. Unverzichtbar zur Überprüfung, ob ein Modell korrekt geladen wurde.
*   `control_joint.py`: Ein einfaches Test-Skript, das die Bewegung eines einzelnen Gelenks (des "Ellbogens") demonstriert.
*   `control_arm.py`: Ein fortgeschrittenes Demo-Skript, das eine koordinierte Bewegungssequenz des gesamten Roboterarms durchführt, inklusive "Aufwachen", "Tanzen" und der Steuerung des Greifers.

Dieses Setup bildet eine stabile Grundlage für weiterführende Entwicklungen wie Teleoperation, autonome Steuerung oder Reinforcement Learning.
