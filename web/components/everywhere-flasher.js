const template = document.createElement('template');
template.innerHTML = `
    <style>
    div {
        padding:20px;
        background-color: rgba(250, 248, 248, 0.5);
        border-radius: 20px;
        border-style: solid;
        border-color: rgb(180, 180, 180, 0.8);
        transition-property: visibility, opacity;
        transition-duration: 0s, 2s;
    }
    .hide {
        opacity: 0;
        visibility: hidden;
        transition-property: opacity, visibility;
        transition-duration: 2s, 0s;
        transition-delay: 0s, 2s;
    }
    </style>
    <div class="hide"><span title=""></span></div>
`;

const life = 4000;
let id = null;

class Flasher extends HTMLElement {
    static get observedAttributes() { return ['text']; }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        let clone = template.content.cloneNode(true);
        root.appendChild(clone);

    }

    attributeChangedCallback(attr, oldValue, newValue) {
        let method = "_" + attr;
        this[method]();
    }

    _text() {
        let value = this.getAttribute("text");
        let span = this.$("span");
        let div  = this.$("div");
        if(id) {
            window.clearTimeout(id);
            id = null;
        }

        if(value) {
            div.classList.remove("hide");
            id = window.setTimeout(() => {
                div.classList.add("hide");
            }, life);
        } else {
            div.classList.add("hide");
        }
        this.$("span").innerHTML = value;
    }

    connectedCallback() {
    }
}
customElements.define('everywhere-flasher', Flasher);
export default Flasher;