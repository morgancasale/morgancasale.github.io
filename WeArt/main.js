import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

import { generalStyle } from "./general-style.js";


class Main extends LitElement {
    static get styles() {
        return [
            generalStyle,
            css`
            main-element{
                display: flex;
                height: 100%;
                justify-content: center;
            }

            .model {
                display: flex;
                height: 50%;
            }
            `
        ];

    }

    render() {
        return html`
            <img class="model" src="https://github.com/morgancasale/HLA_models_screens/blob/main/antlion.png?raw=true">
        `;
    }
}

customElements.define("main-element", Main);