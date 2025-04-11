export default {
    map: {
        id: "mapId",
        options: {
            center: [-28, 136],
            minZoom: 4,
            zoom: 5,
            maxZoom: 19
        },
        layers: [
            {
                type: "tileLayer",
                url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                options: {
                    maxZoom: 20,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    subdomains: ['a', 'b', 'c']
                }
            },
            {
                type: "geoJSONUrl",
                url: "data/locations.json",
                name: "locations"
            },
            {
                type: "geoJSONUrl",
                url: "data/murray_4326.json",
                options: {
                    color: "rgb(0,220,0)",
                    weight:4,
                    name:"Murray River"
                }
            },
            {
                type: "geoJSONUrl",
                url: "data/oodnadatta_track.json",
                options: {
                    color: "rgb(0,220,0)",
                    weight:4,
                    name:"Oodnadatta Track"
                }
            }
        ],
        materialIcons: [
            {
                name: "visited",
                icon: 'thumb_up',                  // Name of Material icon
                iconColor: 'green',                // Material icon color (could be rgba, hex, html name...)
                markerColor: 'rgba(0,255,0,0.5)',  // Marker fill color
                outlineColor: 'black',             // Marker outline color
                outlineWidth: 1,                   // Marker outline width 
                iconSize: [31, 42]                 // Width and height of the icon
            },
            {
                name: "unvisited",
                icon: 'elderly',                   // Name of Material icon
                iconColor: 'darkred',              // Material icon color (could be rgba, hex, html name...)
                markerColor: 'rgba(255,0,0,0.5)',  // Marker fill color
                outlineColor: 'yellow',            // Marker outline color
                outlineWidth: 1,                   // Marker outline width 
                iconSize: [31, 42]                 // Width and height of the icon
            }
        ]
    },
}