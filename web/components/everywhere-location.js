const template = document.createElement('template');
template.innerHTML = `
    <style>
        .hover {
            color: darkred;
        }
        span {
            user-select: none; /* standard syntax */
        }
    </style>
    <span title="Click to centre on map, double click to zoom and centre, shift key on double click zooms out."></span>
`;

class Location extends HTMLElement {
    static get observedAttributes() { return ['name']; }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        let clone = template.content.cloneNode(true);
        root.appendChild(clone);
        this._text = this.innerHTML;

    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr]();
    }

    _name(attr) {
        //let value = this.getAttribute("name");
        //this.$("span").innerHTML = value;
    }

    connectedCallback() {
        //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
        let span = this.$("span");
        span.innerHTML = this._text;

        span.addEventListener("mouseover", () => {
            span.classList.add("hover");

            this.dispatchEvent(new CustomEvent("locationover", {
                bubbles: true,
                detail: {
                    name: this._text
                }
            }));

        });

        span.addEventListener("mouseout", () => {
            span.classList.remove("hover");
        });

        span.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("locationclick", {
                bubbles: true,
                detail: {
                    name: this._text
                }
            }));
        });

        span.addEventListener("dblclick", (ev) => {

            this.dispatchEvent(new CustomEvent("locationdblclick", {
                bubbles: true,
                detail: {
                    name: this._text,
                    modified: ev.shiftKey
                }
            }));
        });

        addEventListener("auxclick", () => {
            this.dispatchEvent(new CustomEvent("locationauxclick", {
                bubbles: true,
                detail: {
                    name: this._text
                }
            }));
        });
    }
}
customElements.define('everywhere-location', Location);
export default Location;