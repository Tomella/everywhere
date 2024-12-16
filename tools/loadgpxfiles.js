import X2JS from "x2js";
import { readdir } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import fs from "fs";

import config from "../lib/config.js";
import metadata from "../data/location_metadata.js";


let x2js = new X2JS();

let featureCollection = {
    "type": "FeatureCollection",
    "features": []
};

let {features} = featureCollection;


/*

Usage: node convertgpxtojson --file=<path_to_gpx_file> --job=<job_name>

Notes: 
   . A point is unique by date time stamp. You can't be in two places at once. A duplicate is ignored.
   . <job_name> will be created if it doesn't already exist.
*/


await run();
console.log("Finit");


async function run() {
    console.log("Start");
    let files = await readdir(config.gpxFiles);
    for(let file  of files.filter(fileName => fileName.toUpperCase().endsWith(".GPX"))) {
        let filePath = config.gpxFiles + "/" + file;
        const contents = await readFile(filePath, { encoding: 'utf8' });
        let feature = wptToFeature(x2js.xml2js(contents).gpx.wpt);
        features.push(feature)
    }
    fs.writeFileSync("../web/data/locations.json", JSON.stringify(featureCollection, null, 2), 'utf8');
    console.log(JSON.stringify(featureCollection, null, 2));
}

function wptToFeature(wpt) {
    console.log(wpt)
    let template =     {
        "type": "Feature",
        "geometry": {
          "type": "Point"
        }
    };

    template.geometry.coordinates = [wpt._lon, wpt._lat]
    template.properties = {
        name: wpt.name,
        description: wpt.desc,
        song: metadata.locations[wpt.desc].song? metadata.locations[wpt.desc].song : wpt.desc,
        href: wpt.link._href,
        text: wpt.link.__text,
        visited: metadata.locations[wpt.desc].visited,
        icon: metadata.locations[wpt.desc].visited ? "visited" : "unvisited"

    };
    return template;
}
