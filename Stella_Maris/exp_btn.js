class ExpBtn extends HTMLElement{
    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback(){
        const deviceName = this.getAttribute("deviceName");

        const shadow = this.attachShadow({ mode: "open" });

        const btn_container = document.createElement('div');
        btn_container.className = "btn_container";
        btn_container.id = "btn_container";

        const deviceButton = document.createElement('md-filled-button');
        deviceButton.textContent = deviceName;
        deviceButton.id = deviceName;
        deviceButton.className = "deviceButton";
        if(deviceName != "Controller"){
            deviceButton.onclick = () => selectDevice(deviceName);
        }

        const optsButton = document.createElement('md-filled-icon-button');
        optsButton.setAttribute("open", "false");
        optsButton.setAttribute("toggle", "false");

        optsButton.innerHTML = `
            <md-icon>
                <svg viewBox="0 0 24 24">
                    <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
                </svg>
            </md-icon>
            <md-icon slot="selected">
                <svg viewBox="0 0 24 24">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
            </md-icon>
        `;
        optsButton.id = "optsButton_" + deviceName;
        optsButton.className = "optsButton";

        const options = document.createElement("opts-menu");
        options.setAttribute("deviceName", deviceName);
        options.id = "options_" + deviceName;

        const style = document.createElement("style");
        style.textContent = `
            .btn_container{
                margin: 10px;
                width: max-content;
                /*height: 2em;*/
                /*position: relative;*/
            }
            .deviceButton{
                margin-right: 2.5px;
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(btn_container);
        btn_container.appendChild(deviceButton);
        btn_container.appendChild(optsButton);
        btn_container.appendChild(options);

        this.addEventListener('opts-rendered', (event) => {
            console.log("Options rendered");

            // optsButton.addEventListener("click", () => {
            //     const optsEl = options.shadowRoot.querySelector("#options_" + deviceName);
            //     optsEl.open = !optsEl.open;
            // });
        });

        optsButton.onclick = () => {
            const optsEl = options.shadowRoot.querySelector("#options_" + deviceName);
            optsEl.open = !optsEl.open;
        }

        // this.addEventListener("close-menu", (event) => {
        //     optsButton.selected = !optsButton.selected;
        // });

        this.addEventListener("ariahiddenchange", (event) => {
            optsButton.selected = !(event.detail.newValue === "true");
        });

    }

    static get observedAttributes() {
        return ["deviceName"];
    }
}

customElements.define('exp-btn', ExpBtn);