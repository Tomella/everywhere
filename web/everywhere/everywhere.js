import config from "./config.js";
import Map from "../app/map.js";
import Position from "../lib/position.js";

let mapManager = new Map(config.map);
mapManager.create();
let map = mapManager.map;

let position = new Position();
map.addControl(position);

document.addEventListener("position", (ev) => {
    let properties = ev.detail.properties;
    let dateStr = properties.time_point ? properties.time_point.substr(0, 10) : "";
    waiPanel.innerHTML = `<a href='byday.html?date=${properties.time_point.substr(0, 10)}' title='View all points on this date.'>${properties.name}</a>`;
});

let features = {};
document.addEventListener("featureadded", ev => {
    // We want to know about 
    features[ev.detail.name] = ev.detail;
    //console.log(ev.detail.name)
});

let locations = document.querySelector("#lyrics");
let flasher = document.querySelector("everywhere-flasher");

// I think there should be a moraorium on firing this if either a click or dblclick has occured in the last x seconds
let timer = Date.now();
locations.addEventListener("locationover", ev => {
    let now = Date.now();
    if(now - timer < 1000) return;    // Maybe it should be paramaterised

    let data = features[ev.detail.name];
    if(data) {
        data.layer.openPopup(null, {autoPanPadding: [50, 50]});
    } else console.log("what? No " + ev.detail.name)
});

locations.addEventListener("locationout", ev => {
    let now = Date.now();
    if(now - timer < 1000) return;    // Maybe it should be paramaterised

    let data = features[ev.detail.name];
    if(data) {
        data.layer.closePopup();
    } else console.log("what? No " + ev.detail.name)
});

locations.addEventListener("locationclick", ev => {
    timer = Date.now();
    let data = features[ev.detail.name];
    if(data) {
        let latLng = getCenter(data.layer);
        map.setView(latLng);
    } else {
        if(!ev.detail.message) {
            popup("Not sure of location of " + ev.detail.name);
        }
    }
    if(ev.detail.message) {
        popup(ev.detail.message);
    }
});

locations.addEventListener("locationdblclick", ev => {
    timer = Date.now();
    let data = features[ev.detail.name];
    let zoom = ev.detail.modified ? -1 : 1;
    if(data) {
        let latLng = getCenter(data.layer);
        map.setView(latLng); 
        map.zoomIn(zoom);
    } else {
        if(!ev.detail.message) {
            popup("Not sure of location of " + ev.detail.name);
        }
    }
    if(ev.detail.message) {
        popup(ev.detail.message);
    }
});

function getCenter(layer) {
    if(layer.getLatLng) return layer.getLatLng();
    if(layer.getCenter) return layer.getCenter();
    // Dunno what  to do here so let it error for now, we can pick up other layers later (if we ever get them) by the trace. 
}

function popup(text) {
    flasher.setAttribute("text", text);
}


L.Control.Toggle = L.Control.extend({
    activeSvgPath: "M792-56 56-792l56-56 736 736-56 56ZM560-514l-80-80v-246h240v160H560v166ZM400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-62l80 80v120q0 66-47 113t-113 47Z",
    inactiveSvgPath: "M400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47Z",
    active: false,
    onAdd: function(map) {
        //<a class="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in" aria-disabled="false"><span aria-hidden="true">+</span></a>
        let template = document.createElement('div');
        //        <a class="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in" aria-disabled="false">
        template.classList.add("leaflet-control", "leaflet-bar");
        template.innerHTML = `
        <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47Z"/>
            </svg>
        </a>
        `;

        let a = template.querySelector("a");
        a.addEventListener("click", (ev) => {
            this.active = !this.active;
            let path = this._container.querySelector("path").setAttribute("d",
                this.active? this.activeSvgPath : this.inactiveSvgPath 
            );

            map.fireEvent("togglemedia", { active: this.active });

        });

        return template;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.toggle = function(opts) {
    return new L.Control.Toggle(opts);
}

L.control.toggle({ position: 'topleft' }).addTo(map);

map.addEventListener("togglemedia", (ev)  => {
    let classList = document.querySelector("#mediaplayer").classList;
    if(ev.active) {
        classList.remove("hide");
    } else {
        classList.add("hide");
    }
});