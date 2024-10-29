import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

import { generalStyle } from "./general-style.js";
import "./mat-button.js";

import {tableToJson, randInt} from "./utils.js";

class Main extends LitElement {

    constructor() {
        super();
        this.sheetAPI = "https://script.google.com/macros/s/AKfycbyqq3mBRzYzA5c4xtglts9utMQfooOCrpFEHPw0ASRdwXNEiHFaFLsmfpyEVumJ9dm0/exec"
        this.sheetID = "1XZ1vGGTOhbiHAEu1_y0nLIKvzKmkNYa5DXyPHaD_pnE";
        this.redrawProb = 10;
        
        this.materials = [];
        this.pic_name = null;
        this.pic_address = null;
    }

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
                background-color: #131929;
            }

            .img_cont{
                width: 100%;
                height: 50%;
                display: flex;
                justify-content: center;
            }

            .model_name{
                color: white;
                font-size: 5vw;
            }

            .btn_cont{
                display: flex;
                width: 100%;
                justify-content: center;
                flex-wrap: wrap;
            }

            .model{
                display: flex;
                flex-wrap: wrap;
            }

            button{
                width: 200px;
                height: 200px;
                font-size: 35px;
            }
            `
        ];

    }

    async fetchMaterials(){
        const query = "select A where A is not null offset 1";
        const sheetName = "materials";

        const base = `https://docs.google.com/spreadsheets/d/${
            this.sheetID
        }/gviz/tq?`;

        const url = `${base}&sheet=${
            encodeURIComponent(sheetName)
        }&tq=${
            encodeURIComponent(query)
        }`;

        fetch(url)
        .then((res) => res.text())
        .then((response) => {
            let temp = tableToJson(response);
            temp.map((material) => {
                this.materials.push(material[""]);
            });
            console.log(this.materials);
            if(!this.materials.includes("Other")){
                this.materials.push("Other");
                //this.materials = this.materials.reverse();
            }
            this.reRender();
        })
        .catch((error) => {
            console.error("Error", error);
        });
    }

    

    async getNextModel(){
        const redraw = randInt(1, 100);
        this.isRedraw = false;

        const sheetName = "models";
        let query = "";

        if(redraw <= this.redrawProb){ // this.redrawProb % chance to redraw a model already seen
            query = "SELECT A WHERE C = 100";
            this.isRedraw = true;
        } else {
            query = "SELECT A WHERE C < 100";
        }

        const base = `https://docs.google.com/spreadsheets/d/${
            this.sheetID
        }/gviz/tq?`;

        const url = `${base}&sheet=${
            encodeURIComponent(sheetName)
        }&tq=${
            encodeURIComponent(query)
        }`;

        fetch(url)
        .then((res) => res.text())
        .then((response) => {
            let temp = tableToJson(response);

            const rand_index = randInt(0, temp.length-1);

            let model_name = temp[rand_index].model; // select a random model
            model_name = model_name.split("/")
            model_name = model_name[model_name.length-1]
            model_name = model_name.split(".")[0]

            this.pic_name = model_name;
            this.pic_address = "https://github.com/morgancasale/HLA_models_screens/blob/main/" 
            this.pic_address += (this.pic_name + ".png?raw=true");
            console.log(this.pic_address);
            this.reRender();
        })
        .catch((error) => {
            console.error("Error", error);
        });
    }

    async fetchData() {
        await this.getNextModel();
        await this.fetchMaterials();
        //await this.reRender();
        //await this.requestUpdate();
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchData();
    }

    async reRender(){
        await this.render();
        await this.requestUpdate();
        await new Promise(r => setTimeout(r, 1));
    }

    render() {
        if(this.materials.length === 0 | this.pic_address === null){
            return html`
                <div>Loading...</div>
            `;
        } else {
            return html`
                <div class="container">
                    <div class="img_cont"> 
                        <img class="model" src=${this.pic_address}>
                    </div>

                    <div class="model_name">
                        ${ (this.isRedraw ? "Redraw: " : "") + this.pic_name}
                    </div>
                    
                    <div class="btn_cont">
                        ${this.materials.map((material) => {
                            return html`
                                <mat-button 
                                    .sheetAPI=${this.sheetAPI} 
                                    .material=${material} 
                                    .pic_name=${this.pic_name}
                                ></mat-button>
                            `;
                        })}
                    </div>
                </div>
            `;
        }
    }
}

customElements.define("main-element", Main);

