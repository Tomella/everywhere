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
    console.log(ev.detail.name)
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
