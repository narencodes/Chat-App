// File to manage document event globally from directives

// Store the events that should happen only one at a time in a Document
let documentEvents = {},
    keyBoardEvents = {};

let initListener = event => document.addEventListener(event, dispatchEvent);

let removeEvent = (event, callback) => {
    let events = documentEvents[event];
    if (!events) {
        return;
    }
    let index = events.indexOf(callback);
    index > -1 && events.splice(index, 1);
    if (!events.length) {
        dumpEventListener(event);
        delete documentEvents[event];
    }
}

let dumpEventListener = event => {
    document.removeEventListener(event, dispatchEvent);
}
// Dispatch the last callback function
let dispatchEvent = ev => {
    let callback = [...documentEvents[ev.type]].pop();
    callback(ev);
}

let addEvent = (event, callback) => {
    if (documentEvents[event]) {
        return documentEvents[event].push(callback);
    }
    initListener(event);
    documentEvents[event] = [callback];
}

let addKeyEvent = (key, callback) => {
    key = key.toLowerCase();
    if (keyBoardEvents[key]) {
        return keyBoardEvents[key].push(callback);
    }
    !documentEvents.keydown && addEvent('keydown', dispatchKeyPress);
    keyBoardEvents[key] = [callback];
}

let dispatchKeyPress = ev => {
    let key = ev.key.toLowerCase();
    if (keyBoardEvents[key]) {
        let callback = [...keyBoardEvents[key]].pop();
        callback(ev);
    }
}

let removeKeyEvent = (key, callback) => {
    key = key.toLowerCase();
    let keyEvents = keyBoardEvents[key];
    if (!keyEvents) {
        return;
    }
    let index = keyEvents.indexOf(callback);
    index > -1 && keyEvents.splice(index, 1);
    if (!keyEvents.length) {
        removeEvent('keydown', dispatchKeyPress);
        delete keyBoardEvents[key];
    }
}

export {
    addEvent,
    addKeyEvent,
    removeEvent,
    removeKeyEvent
}