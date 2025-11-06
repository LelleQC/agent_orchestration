class InputController {
    constructor() {
        this.keys = {};
        document.addEventListener('keydown', (e) => this._onKey(e, true));
        document.addEventListener('keyup', (e) => this._onKey(e, false));
    }

    _onKey(event, isPressed) {
        this.keys[event.code] = isPressed;
    }

    isPressed(keyCode) {
        return this.keys[keyCode] || false;
    }
}