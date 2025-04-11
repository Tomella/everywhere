import fs from "fs";

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const oodnadattaJson = loadJSON('../data/oodnadatta_track.json');

const template = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Oodnadatta Track",
                "description": "Oodnadatta Track",
                "song": "Oodnadatta Track",
                "href": "https://en.wikipedia.org/wiki/Oodnadatta_Track",
                "visited": true,
                "song": "Oodnadatta road",
            },
            "geometry": {
                "type": "LineString",
                "coordinates": []
            }
        }
    ]
};

oodnadattaJson.route.track_points.reduce((acc, point, idx) => {
    if(idx % 4) // Only a quarter of them
        acc.push([point.x, point.y]);
    return acc;
}, template.features[0].geometry.coordinates);


fs.writeFileSync("../web/data/oodnadatta_track.json", JSON.stringify(template, null, 2), 'utf8');