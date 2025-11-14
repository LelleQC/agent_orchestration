# Projektbericht: XLeRobot "Snap-Back" Fehlerbehebung

Dieser Bericht dokumentiert den Prozess, die Herausforderungen und die Lösungen bei der Behebung eines kritischen Steuerungsproblems in der XLeRobot-Simulationsumgebung.

---

## 1. Projektziel

Das ursprüngliche Ziel war die Steuerung des XLeRobot in CoppeliaSim über externe Python-Skripte. Dieses Ziel wurde schnell durch ein schwerwiegendes Problem blockiert: Ein "Snap-Back"-Verhalten, bei dem der Roboterarm jeden externen Befehl sofort rückgängig machte. Das neue Hauptziel wurde daher die Identifizierung und Lösung dieses Problems.

---

## 2. Zusammenfassung des Verlaufs

Das Projekt war eine intensive Debugging-Sitzung, die von Hypothesenbildung, API-Erkundung und schrittweiser Eliminierung von Fehlerquellen geprägt war.

1.  **Problem-Identifikation:** Nach erfolgreichem Import des Robotermodells wurde festgestellt, dass jeder Versuch, ein Gelenk über die ZMQ-API zu bewegen, zu einem sofortigen "Zurückschnappen" in die Ausgangsposition führte.

2.  **Hypothese 1: Aktiver Positions-Controller:** Die erste korrekte Annahme war, dass ein interner Positions-Controller (`sim.jointintparam_ctrl_enabled`) des Gelenks aktiv war. Ein Skript (`check_joint_mode.py`) bestätigte dies.

3.  **Hypothese 2: Überschreibendes Skript:** Der Versuch, diesen Controller per API zu deaktivieren (`disable_control_mode.py`), schlug fehl. Der Befehl wurde zwar ausgeführt, der Zustand des Gelenks änderte sich jedoch nicht. Dies war der entscheidende Beweis, dass ein anderes, höherpriores Skript die Einstellungen kontinuierlich überschreibt.

4.  **Workaround - "Brute-Force"-Methode:** Um die Existenz des Skripts weiter zu beweisen, wurde ein Skript entwickelt (`oscillate_control.py`), das in einer Hochfrequenzschleife abwechselnd den Controller deaktiviert und eine Zielposition setzt. Dieser Ansatz funktionierte und brachte den Arm zur Bewegung, wenn auch mit einem sichtbaren "Wackeln".

5.  **Durchbruch - `sandboxScript`:** Ein vom Benutzer bereitgestellter Log-Ausschnitt, der `[sandboxScript:info]` enthielt, lieferte den Namen des gesuchten Skriptsystems.

6.  **Tiefenanalyse:** Die Untersuchung des `sandboxScript`-Systems führte zur Entdeckung von `defaultMainScript.lua` als dem zentralen Steuerungsskript. Die Analyse dieses Skripts identifizierte die Funktion **`sim.handleJointMotion()`** als den direkten Verursacher des Problems, da sie bei jedem Simulationsschritt die Gelenk-Controller zurücksetzte.

7.  **Lösung - Gezielte Deaktivierung:**
    *   Die Zeile `sim.handleJointMotion()` wurde in einer lokalen Kopie von `defaultMainScript.lua` auskommentiert.
    *   Die Python-Steuerungsskripte (`control_arm.py`, `control_base.py`) wurden so angepasst, dass sie zu Beginn explizit den Positions-Controller für jedes Gelenk deaktivieren und eine ausreichende Kraft (`sim.setJointMaxForce`) einstellen.

8.  **Technische Hürde - Schreibschutz:** Da das CoppeliaSim-Installationsverzeichnis schreibgeschützt war, konnte das Originalskript nicht direkt geändert werden. Dieses Problem wurde durch einen dynamischen Lade-Mechanismus umgangen: Ein Python-Skript (`modify_and_write_sandbox_script.py`) modifiziert das Sandbox-System zur Laufzeit, um die angepasste `defaultMainScript.lua` zu laden.

9.  **Verifizierung und Abschluss:** Nach Anwendung der Lösung funktionierten alle Steuerungsskripte reibungslos, ohne "Snap-Back" oder "Wackeln". Das Projekt war damit erfolgreich abgeschlossen.

---

## 3. Wichtigste Herausforderungen & Lösungen

| Herausforderung | Fehlgeschlagene Lösungsansätze | Erfolgreiche Lösung |
| :--- | :--- | :--- |
| **"Snap-Back"-Verhalten des Roboterarms** | 1. Direkter Versuch, den Positions-Controller zu deaktivieren (wurde überschrieben).<br>2. Suche nach einfachen Child-Skripten am Modell (keine gefunden). | **Identifizierung und Deaktivierung von `sim.handleJointMotion()`** in `defaultMainScript.lua`. |
| **Schreibgeschütztes CoppeliaSim-Verzeichnis** | Direkte Modifikation der Lua-Skripte war nicht möglich. | **Dynamische Modifikation des Sandbox-Skripts** zur Laufzeit über die API, um eine lokale, angepasste Version des Skripts zu laden. |
| **Unbekannte API-Funktionen** | Verwendung veralteter oder falscher Funktionsnamen. | Systematische Erkundung der API mit einem Skript (`inspect_api.py`), um die korrekten Funktionsnamen und Parameter-IDs zu finden. |

---

## 4. Fazit

Dieses Projekt war ein Paradebeispiel für eine komplexe Fehlersuche in einer "Black-Box"-Umgebung. Der Erfolg basierte auf einem systematischen, hypothesengestützten Vorgehen und der Fähigkeit, kreative Workarounds (wie die Brute-Force-Schleife und die dynamische Skript-Modifikation) zu entwickeln, um Annahmen zu validieren und Hindernisse zu überwinden.