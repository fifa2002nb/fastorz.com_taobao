// Type definitions for clipboard.js 1.5
// Project: https://github.com/zenorocha/clipboard.js
// Definitions by: Andrei Kurosh <https://github.com/impworks>
    // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare class Clipboard {
    constructor(selector: (string | Element | NodeListOf<Element>), options?: Clipboard.Options);

    /**
    * Subscribes to events that indicate the result of a copy/cut operation.
    * @param type {"success" | "error"} Event type ('success' or 'error').
    * @param handler Callback function.
    */
    on(type: "success" | "error", handler: (e: Clipboard.Event) => void): this;
    on(type: string, handler: (...args: any[]) => void): this;

    /**
    * Clears all event bindings.
    */
    destroy(): void;
}

declare namespace Clipboard {
    interface Options {
        action?: (elem: Element) => string;
        target?: (elem: Element) => Element;
        text?: (elem: Element) => string;
    }

    interface Event {
        action: string;
        text: string;
        trigger: Element;
        clearSelection(): void;
    }
}

declare module 'clipboard' {
    export = Clipboard;
}

//export as namespace Clipboard;

