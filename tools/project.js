/*
 Sadly the onl Murray River vector data was im EPSG:3112 so transformed for Leaflet to consume as 4326.
*/

import proj4 from "proj4";
import fs from "fs";

const epsg3112 = proj4.defs("EPSG:3112","+proj=lcc +lat_0=0 +lon_0=134 +lat_1=-18 +lat_2=-36 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const murrayGeoJson = loadJSON('../data/murray.json');


const features = murrayGeoJson.features;
// Transform the coordinates in situ and then write it to the file
murrayGeoJson.features.forEach(feature => {
    feature.geometry.coordinates.forEach(coordinates => {
        coordinates.forEach(line => {
            let coordinate = proj4("EPSG:3112", "EPSG:4326", line)
            //console.log(coordinate);
            line[0] = coordinate[0];
            line[1] = coordinate[1];
        })
    });
    feature.properties.href = "https://en.wikipedia.org/wiki/Murray_River",
    feature.properties.visited = true;
});

delete murrayGeoJson.crs;
//console.log(JSON.stringify(murrayGeoJson,null, 2));


// Now we have modified the GeoJSON, write it out.
fs.writeFileSync("../web/data/murray_4326.json", JSON.stringify(murrayGeoJson, null, 2), 'utf8');

