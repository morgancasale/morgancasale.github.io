import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

import { generalStyle } from "./general-style.js";

class MatButton extends LitElement {

    static get properties() {
        return {
            material : { type: String },
            pic_name : { type: String }
        };
    }

    static get styles() {
        return [
            generalStyle,
            css`
            button{
                width: 200px;
                height: 200px;
                font-size: 35px;
            }
            `
        ];
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

        var url = "https://script.google.com/macros/s/AKfycbwC7vj9jC9VbNzKOI2eFl0wdVt--bYt5F80Dti9VzRS5BeBwM01rLs_Uy5UIe3DpDXv/exec";
        var request = {
            method: "POST",
            body: JSON.stringify(data)
        }
        fetch(url, request)
    }

    render() {
        return html`
            <button @click=${this.set_material}>${this.material}</button>
        `;
    }
}

customElements.define("mat-button", MatButton);