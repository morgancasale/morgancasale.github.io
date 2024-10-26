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
                flex-wrap: wrap;
                align-items: center;
            }

            .img_cont{
                width: 100%;
                height: 50%;
                display: flex;
                justify-content: center;
            }

            .btn_cont{
                display: flex;
                width: 100%;
                justify-content: center;
            }

            .model{
                display: flex;
                
            }
            `
        ];

    }

    render() {
        return html`
            <div class="container">
                <div class="img_cont"> 
                    <img class="model" src="https://github.com/morgancasale/HLA_models_screens/blob/main/antlion.png?raw=true">
                </div>
                
                <div class="btn_cont">
                    <button>Ciao</button>
                </div>
            </div>
        `;
    }
}

customElements.define("main-element", Main);