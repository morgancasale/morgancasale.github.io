import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element@4.0.0/lit-element.js?module";

import { generalStyle } from "./general-style.js";


class Main extends LitElement {
    static get styles() {
        return [
            generalStyle,
            css``
        ];
    }

    render() {
        return html`
            <h1>Hello, World!</h1>
        `;
    }
}

customElements.define("main-element", Main);