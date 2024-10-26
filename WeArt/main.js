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
            .container{
                display: flex;
                height: 100%;
                justify-content: center;
            }

            .model{
                display: flex;
                height: 50%;
            }
            `
        ];

    }

    render() {
        return html`
            <div class="container">
                <img class="model" src="https://github.com/morgancasale/HLA_models_screens/blob/main/antlion.png?raw=true">
                <el-button>Default</el-button>
            </div>
        `;
    }
}

customElements.define("main-element", Main);