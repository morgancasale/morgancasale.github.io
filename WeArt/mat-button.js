import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

import { generalStyle } from "./general-style.js";

class MatButton extends LitElement {

    static get properties() {
        return {
            sheetAPI : { type: String },
            material : { type: String },
            pic_name : { type: String }
        };
    }

    static get styles() {
        return [
            generalStyle,
            css`
            button{
                width: 10vw;
                aspect-ratio: 1;
                margin: 0.5vw;
                border: 0;
                font-size: 2vw;
            }

            .other-btn{
                background-color: #f44336;
                color: white;
            }
            `
        ];
    }

    async clean_and_reload() {
        if ('caches' in window) {
            caches.keys().then(names => {
              for (let name of names) caches.delete(name);
            }).then(() => {
              console.log("Cache del sito corrente eliminata.");
            });
        }
        await new Promise(r => setTimeout(r, 1));
        location.reload()
    }

    set_material() {
        var model_name = this.pic_name.split("/")
        model_name = model_name[model_name.length-1]
        model_name = model_name.split(".")[0]

        var data = {
            "sheet_name" : "models",
            "func" : "set_material",
            "model" : model_name,
            "material" : this.material
        }

        var request = {
            method: "POST",
            body: JSON.stringify(data)
        }
        fetch(this.sheetAPI, request)
        .then(async ()=> {
            this.clean_and_reload()
        })
    }

    render() {
        if (this.material == "Other") {
            return html`
                <button id="mat-btn" class="other-btn" @click=${this.set_material}>${this.material}</button>
            `;
        } else {
            return html`
                <button id="mat-btn" @click=${this.set_material}>${this.material}</button>
            `;
        }
    }
}

customElements.define("mat-button", MatButton);