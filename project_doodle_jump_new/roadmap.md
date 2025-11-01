# Roadmap: Doodle Jump Klon

---

## 🧭 1. Initial Analysis

*   **Goal:** Erstellung eines spielbaren, browser-basierten Klons des Spiels "Doodle Jump".
*   **MVP Definition:**
    *   Ein Spielercharakter, der kontinuierlich auf- und abspringt.
    *   Prozedural generierte Plattformen, auf denen der Spieler landen kann.
    *   Horizontale Steuerung des Spielers (links/rechts) durch den Benutzer.
    *   Die Kamera (der sichtbare Spielbereich) folgt dem Spieler nach oben.
    *   Das Spiel endet, wenn der Spieler unten aus dem Bildschirm fällt.
*   **Technology:** Pures HTML, CSS, und JavaScript.
*   **Complexity:** Mittel.

---

## 🧠 2. Learnings from Knowledge Base (INC-2025-001)

*   **Browser-Kompatibilität:** Es werden keine Node.js-Module (`require`/`module.exports`) verwendet. Der gesamte Code wird für eine direkte Ausführung im Browser konzipiert.
*   **Initialzustand:** Der Spieler muss einen initialen Sprungimpuls erhalten, um das Spiel spielbar zu starten.
*   **Testbarkeit:** Die Architektur muss von Anfang an so gestaltet sein, dass der "First Playable Action" (der erste Sprung) automatisiert getestet werden kann.

---

## 🪜 3. Task Decomposition (MVP)

### Phase 1: Grundgerüst & Spielwelt
- `[DONE]` Erstelle `index.html` mit einem `<canvas>` Element.
- `[DONE]` Erstelle `style.css` für grundlegendes Styling (z.B. Canvas zentrieren).
- `[DONE]` Erstelle `script.js` und richte eine grundlegende Spiel-Schleife (`requestAnimationFrame`) ein.
- `[DONE]` Implementiere eine `Game`-Klasse, die den Zustand und die Logik kapselt.

### Phase 2: Spieler-Implementierung
- `[DONE]` Erstelle eine `Player`-Klasse mit Position, Größe und Geschwindigkeit.
- `[DONE]` Zeichne den Spieler auf dem Canvas.
- `[DONE]` Implementiere die Gravitation, die den Spieler nach unten beschleunigt.
- `[DONE]` Implementiere die Sprunglogik, die die vertikale Geschwindigkeit des Spielers umkehrt.

### Phase 3: Test-Infrastruktur & Erster Test
- `[DONE]` Die `Game`-Klasse muss eine `getGameState()`-Methode bereitstellen, um den Spielerstatus abzufragen.
- `[DONE]` Erstelle eine Test-Datei (`doodle.test.js`) und eine Test-HTML (`test.html`).
- `[DONE]` Schreibe einen fehlschlagenden Test, der prüft, ob der Spieler nach der Initialisierung eine positive vertikale Geschwindigkeit hat (Initialer Sprung aus INC-2025-001).

### Phase 4: Plattformen & Interaktion
- `[DONE]` Erstelle eine `Platform`-Klasse.
- `[DONE]` Implementiere die prozedurale Generierung von Plattformen.
- `[DONE]` Implementiere die Kollisionserkennung zwischen Spieler und Plattformen. Ein Sprung soll nur ausgelöst werden, wenn der Spieler von oben auf eine Plattform fällt.

### Phase 5: Steuerung & Kamera
- `[DONE]` Implementiere die horizontale Steuerung des Spielers via Tastatur (Pfeiltasten).
- `[DONE]` Implementiere eine einfache Kamera, die dem Spieler nach oben folgt.

### Phase 6: Spielzustand
- `[DONE]` Implementiere die "Game Over"-Bedingung, wenn der Spieler unter den unteren Bildschirmrand fällt.
