import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

import { generalStyle } from "./general-style.js";
import "./mat-button.js";


class Main extends LitElement {

    constructor() {
        super();
        this.sheetAPI = "https://script.google.com/macros/s/AKfycbyqq3mBRzYzA5c4xtglts9utMQfooOCrpFEHPw0ASRdwXNEiHFaFLsmfpyEVumJ9dm0/exec"
        this.sheetID = "1XZ1vGGTOhbiHAEu1_y0nLIKvzKmkNYa5DXyPHaD_pnE";
        this.sheetName = "materials";
        this.query = "select A where A is not null offset 1";
        this.materials = [];
        this.pic_name = "antlion";
        this.pic_address = "https://github.com/morgancasale/HLA_models_screens/blob/main/"+this.pic_name+".png?raw=true";
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

    tableToJson(res) {
        // credit to Laurence Svekis https://www.udemy.com/course/sheet-data-ajax/
        const jsData = JSON.parse(res.substring(47).slice(0, -2));
        let data = [];
        const columns = jsData.table.cols;
        const rows = jsData.table.rows;
        let rowObject;
        let cellData;
        let propName;
        for (let r = 0, rowMax = rows.length; r < rowMax; r++) {
          rowObject = {};
          for (let c = 0, colMax = columns.length; c < colMax; c++) {
            cellData = rows[r]["c"][c];
            propName = columns[c].label;
            if (cellData === null) {
              rowObject[propName] = "";
            } else if (
              typeof cellData["v"] == "string" &&
              cellData["v"].startsWith("Date")
            ) {
              rowObject[propName] = new Date(cellData["f"]);
            } else {
              rowObject[propName] = cellData["v"];
            }
          }
          data.push(rowObject);
        }
        return data;
    }

    fetchMaterials(){
        const base = `https://docs.google.com/spreadsheets/d/${this.sheetID}/gviz/tq?`;
        const url = `${base}&sheet=${encodeURIComponent(
        this.sheetName
        )}&tq=${encodeURIComponent(this.query)}`;

        fetch(url)
        .then((res) => res.text())
        .then((response) => {
            let temp = this.tableToJson(response);
            temp.map((material) => {
                this.materials.push(material[""]);
            });
            console.log(this.materials);
            this.reRender();
        })
        .catch((error) => {
            console.error("Error", error);
        });

        this.materials.push("Other");
        this.materials = this.materials.reverse();
    }

    fetchData() {
        this.fetchMaterials();
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
        if(this.materials.length === 0){
            return html`
                <div>Loading...</div>
            `;
        } else {

            return html`
                <div class="container">
                    <div class="img_cont"> 
                        <img class="model" src="https://github.com/morgancasale/HLA_models_screens/blob/main/antlion.png?raw=true">
                    </div>
                    
                    <div class="btn_cont">
                        ${this.materials.map((material) => {
                            return html`
                                <mat-button 
                                    .sheetAPI=${this.sheetAPI} .material=${material} .pic_name=${this.pic_name}
                                ></mat-button>
                            `;
                        })}
                    </div>
                    <div class="other_cont">

                </div>
            `;
        }
    }
}

customElements.define("main-element", Main);