const Shift = {
    UNSHIFTED: "unshifted",
    SHIFTED: "shifted",
};

const layout = {
    "Digit1": {unshifted: "\u09E7", shifted: "!"},
    "Digit2": {unshifted: "\u09E8", shifted: "@"},
    "Digit3": {unshifted: "\u09E9", shifted: "\u09CD\u09B0"},
    "Digit4": {unshifted: "\u09EA", shifted: "\u09B0\u09CD"},
    "Digit5": {unshifted: "\u09EB", shifted: "\u099C\u09CD\u099E"},
    "Digit6": {unshifted: "\u09EC", shifted: "\u09A4\u09CD\u09B0"},
    "Digit7": {unshifted: "\u09ED", shifted: "\u0995\u09CD\u09B7"},
    "Digit8": {unshifted: "\u09EE", shifted: "\u09B6\u09CD\u09B0"},
    "Digit9": {unshifted: "\u09EF", shifted: "("},
    "Digit0": {unshifted: "\u09E6", shifted: ")"},
    "Minus": {unshifted: "-", shifted: "\u0983"},
    "Equal": {unshifted: "\u09C3", shifted: "\u098B"},
    
    "KeyQ": {unshifted: "\u09CC", shifted: "\u0994"},
    "KeyW": {unshifted: "\u09C8", shifted: "\u0990"},
    "KeyE": {unshifted: "\u09BE", shifted: "\u0986"},
    "KeyR": {unshifted: "\u09C0", shifted: "\u0988"},
    "KeyT": {unshifted: "\u09C2", shifted: "\u098A"},
    "KeyY": {unshifted: "\u09AC", shifted: "\u09AD"},
    "KeyU": {unshifted: "\u09B9", shifted: "\u0999"},
    "KeyI": {unshifted: "\u0997", shifted: "\u0998"},
    "KeyO": {unshifted: "\u09A6", shifted: "\u09A7"},
    "KeyP": {unshifted: "\u099C", shifted: "\u099D"},
    "BracketLeft": {unshifted: "\u09A1", shifted: "\u09A2"},
    "BracketRight": {unshifted: "\u09BC", shifted: "\u099E"},
    "Backslash": {unshifted: "\\", shifted: "?"},
    
    "KeyA": {unshifted: "\u09CB", shifted: "\u0993"},
    "KeyS": {unshifted: "\u09C7", shifted: "\u098F"},
    "KeyD": {unshifted: "\u09CD", shifted: "\u0985"},
    "KeyF": {unshifted: "\u09BF", shifted: "\u0987"},
    "KeyG": {unshifted: "\u09C1", shifted: "\u0989"},
    "KeyH": {unshifted: "\u09AA", shifted: "\u09AB"},
    "KeyJ": {unshifted: "\u09B0"},
    "KeyK": {unshifted: "\u0995", shifted: "\u0996"},
    "KeyL": {unshifted: "\u09A4", shifted: "\u09A5"},
    "Semicolon": {unshifted: "\u099A", shifted: "\u099B"},
    "Quote": {unshifted: "\u099F", shifted: "\u09A0"},
    
    "KeyZ": {unshifted: "#", shifted: "\u09F3"}, // Taka
    "KeyX": {unshifted: "\u0982", shifted: "\u0981"},
    "KeyC": {unshifted: "\u09AE", shifted: "\u09A3"},
    "KeyV": {unshifted: "\u09A8"},
    "KeyB": {unshifted: "\u09AC", shifted: "\u200C"}, // ZWNJ
    "KeyN": {unshifted: "\u09B2"},
    "KeyM": {unshifted: "\u09B8", shifted: "\u09B6"},
    "Comma": {unshifted: ",", shifted: "\u09B7"},
    "Period": {unshifted: ".", shifted: "\u0964"}, // Dari
    "Slash": {unshifted: "\u09DF", shifted: "\u09AF"},
};

(() => {
    var state = {
        contextID: -1,
    };
    
    chrome.input.ime.onFocus.addListener((context) => {
        state.contextID = context.contextID;
    });
    
    chrome.input.ime.onKeyEvent.addListener((engineID, keyData, requestId) => {
        // Ignore Alt and Ctrl chords for cut/copy/paste, save, etc.
        if (keyData.ctrlKey || keyData.altKey) {
            return false;
        }
        
        let modState = {
            // Caps Lock is ignored.
            shift: keyData.shiftKey ? Shift.SHIFTED : Shift.UNSHIFTED,
        };
        
        // Keys not defined in the layout are passed on to the underlying (US) layout.
        if (layout.hasOwnProperty(keyData.code) && keyData.type == "keydown") {
            let out = layout[keyData.code][modState.shift];
            
            if (out != undefined) {
                chrome.input.ime.commitText({
                    "contextID": state.contextID,
                    "text": out,
                });
                return true;
            } else if (out === null) {
                // Allows the layout to explicitly pass an event on to the underlying (US) layout.
                return false;
            }
        } else {
            return false;
        }
    });
})();
