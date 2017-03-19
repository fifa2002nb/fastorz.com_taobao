// Type definitions for angular-clipboard v1.5
// Project: https://github.com/omichelsen/angular-clipboard
// Definitions by: Bradford Wagner <https://github.com/bradfordwagner/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/**
 * Definition of the Clipboard Service
  */

  declare module "angular-clipboard" {
     export interface ClipboardService {
        /**
        * tells us whether or not angular-clipboard is supported
        */
        supported: boolean;

        /**
        * copies text to a clipboard
        * @param text the text to be copied to the clipboard
        */
        copyText(text: string): void;
    }
  }
