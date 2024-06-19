if (typeof ContendCmsCard === "undefined") {
    class ContendCmsCard extends ContendCmsCustomElement {
        static observedAttributes = ["header"];

        constructor() {
            super();
        }

        connectedCallback() {
            const shadow = this.getShadow();

            const header = document.createElement("h1");
            header.className = "card-header";
            header.innerText = this.getAttribute("header");

            shadow.appendChild(header);
        }

        onChangedAttribute(name, oldValue, newValue) {
            if (name === "header") {
                const header = this.shadowRoot.querySelector("h1");
                header.innerText = newValue;
            }
        }
    }
    customElements.define("contend-cms-card", ContendCmsCard);
}