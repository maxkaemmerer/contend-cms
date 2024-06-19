function isDebug() {
    return location.search.includes("DEBUG=true");
}

function formatLog(message, source) {
    return `${source}: ${message}`
}

class ContendCmsCustomElement extends HTMLElement {
    initialized = false;

    constructor() {
        super();
    }

    getShadow() {
        return this.shadowRoot || this.attachShadow({ mode: "open" });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.initialized) {
            if (isDebug()) {
                console.log(formatLog(`Attribute "${name}" has changed from "${oldValue}" to "${newValue}".`, `${this.constructor.name}-${this.getAttribute("contend-cms-id")}`));
            }

            if (this.onChangedAttribute) {
                this.onChangedAttribute(name, oldValue, newValue);
            }
        }

        this.initialized = true;
    }
}

class ContendCmsElements extends ContendCmsCustomElement {
    static observedAttributes = ["source-url"];

    renderedElements = [];

    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttribute("contend-cms-id", "root");
        this.fetchAndRenderElements(this.getAttribute("source-url"), false)
    }

    async fetchAndRenderElements(sourceUrl, update) {
        const response = await fetch(sourceUrl, {
            method: "GET"
        });

        if (response.ok) {
            const responseBody = await response.json();

            if (responseBody.scripts) {
                // load all unloaded scripts
                const scriptsNotLoaded = responseBody.scripts.filter(script => document.querySelector(`script[src='${script}']`) === null);
                await Promise.all(scriptsNotLoaded.map(script => this.loadScript(script)));
            }

            // if we refetch and the returned elements are different we re-render all elemnts
            if (this.elementsChanged(responseBody.elements, update)) {
                if (isDebug()) {
                    console.log(formatLog("Detaching elements after update because they changed entirely.", this.rootElementName()));
                }
                this.getShadow().childNodes.forEach(child => this.getShadow().removeChild(child))
            }

            if (responseBody.elements) {
                const shadow = this.getShadow();
                responseBody.elements.forEach(element => {
                    const elementTag = `contend-cms-${element.elementType}`;

                    const initialElement = shadow.querySelector(`${elementTag}[contend-cms-id='${element.elementId}']`);
                    let customElement = initialElement;
                    // if the element does not exist we create it
                    if (customElement === null) {
                        if(isDebug()) {
                            console.log(formatLog(`Rendering element ${element.elementId} of type ${element.elementType}`, this.rootElementName()));
                        }
                        customElement = document.createElement(elementTag);
                        customElement.setAttribute("contend-cms-id", element.elementId);
                    }

                    if (element.properties) {
                        Object.keys(element.properties).forEach(propertyName => {
                            const value = element.properties[propertyName];
                            // set all changed properties
                            if (customElement.getAttribute(propertyName) !== value) {
                                customElement.setAttribute(propertyName, value);
                            }
                        });
                    }

                    // append element if it was not just created
                    if (initialElement === null) {
                        shadow.appendChild(customElement);
                    }
                });
            }

            this.renderedElements = responseBody.elements.map(element => element.elementId);
        }
    }

    elementsChanged(elements, update) {
        return update && this.renderedElements.join() !== elements.map(element => element.elementId).join();
    }

    loadScript(script) {
        if (isDebug()) {
            console.log(formatLog(`Loading Script ${script}`, this.rootElementName()));
        }
        const scriptElement = document.createElement('script');
        return new Promise((res) => {
            scriptElement.src = script;
            scriptElement.onload = () => {
                res();
            }
            document.head.appendChild(scriptElement);
        });
    }

    onChangedAttribute(name, oldValue, newValue) {
        if (name === "source-url") {
            this.fetchAndRenderElements(newValue, true)
        }
    }

    rootElementName() {
        return `${this.constructor.name}-root`
    }
}

customElements.define("contend-cms-elements", ContendCmsElements);