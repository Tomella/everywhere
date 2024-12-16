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
});

let locations = document.querySelector("#lyrics");
locations.addEventListener("locationover", ev => {
    let data = features[ev.detail.name];
    if(data) {
        data.layer.openPopup(null, {autoPanPadding: [50, 50]});
    } else console.log("what? No " + ev.detail.name)
});

locations.addEventListener("locationclick", ev => {
    let data = features[ev.detail.name];
    if(data) {
        let latLng = data.layer.getLatLng();
        map.setView(latLng);
    } else console.log("what? No " + ev.detail.name)
});

locations.addEventListener("locationdblclick", ev => {
    let data = features[ev.detail.name];
    let zoom = ev.detail.modified ? -1 : 1;
    if(data) {
        let latLng = data.layer.getLatLng();
        map.setView(latLng); 
        map.zoomIn(zoom);
    } else console.log("what? No " + ev.detail.name)
});
