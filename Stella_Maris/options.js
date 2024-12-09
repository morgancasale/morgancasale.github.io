class Opts extends HTMLElement{
    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback(){
        const deviceName = this.getAttribute("deviceName");
        const shadow = this.attachShadow({ mode: "open" });

        const opt_container = document.createElement('div');
        opt_container.className = "opt_container";
        opt_container.id = "opt_container";

        const options = document.createElement("md-menu");
        options.className = "options";
        options.id = "options_" + deviceName;

        const anchorEl = window.document.querySelector("#"+deviceName).shadowRoot.querySelector("#optsButton_"+deviceName);

        options.anchorElement = anchorEl;

        options.innerHTML = `
            <md-menu-item>
                <div slot="headline">Apple</div>
            </md-menu-item>
            <md-menu-item>
                <div slot="headline">Banana</div>
            </md-menu-item>
            <md-menu-item>
                <div slot="headline">Cucumber</div>
            </md-menu-item>
        `;

        const style = document.createElement("style");
        style.textContent = `
            .btn_container{
                margin: 10px;
                width: max-content;
                height: 2em;
            }
            .deviceButton{
                margin-right: 2.5px;
            }
        `;

        shadow.appendChild(opt_container);
        opt_container.appendChild(options);

        const event = new CustomEvent('opts-rendered', { bubbles: true, composed: true });
        this.dispatchEvent(event);

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.attributeName === 'aria-hidden') {
                // Fire a custom event when 'aria-hidden' changes
                this.dispatchEvent(
                    new CustomEvent('ariahiddenchange', {
                        bubbles: true,
                        composed: true,
                        detail: { newValue: options.getAttribute('aria-hidden') }
                    })
                );
              }
            }
        });

        observer.observe(options, { attributes: true });
    }

    

    static get observedAttributes() {
        return ["deviceName"];
    }
}

customElements.define('opts-menu', Opts);