import Eventer from "../lib/eventer.js";

let icons = {};

export default class Map extends Eventer {
   constructor(config) {
      super(); 
      this.config = config;
   }
   create() {
      let config = this.config;

      decorateLeaflet(config);

      this.map = L.map(config.id, config.options);
      window.map = this.map;
      config.layers.forEach(layer => {
         this.addLayer(layer);
      });

      if(config.scale) {
         L.control.scale(config.scale).addTo(this.map);
      }

      if(config.measure) {
         L.control.polylineMeasure(config.measure).addTo(this.map);
         this.map.on('polylinemeasure:start', currentLine => {
            this.dispatchEvent(new CustomEvent("measure-start", {
               composed: true,
               bubbles: true,
               detail: {name: "measure-start"}
            }));
         });
         this.map.on('polylinemeasure:finish', currentLine => {
            this.dispatchEvent(new CustomEvent("measure-finish", {
               composed: true,
               bubbles: true,
               detail: {name: "measure-finish"}
            }));
         });
         this.map.on('polylinemeasure:toggle', evt => {
            this.dispatchEvent(new CustomEvent("measure-toggle", {
               composed: true,
               bubbles: true,
               detail: {name: "measure-toggle", enabled: evt.status}
            }));
         });
      }
   }

   addLayer(config) {
      let layer =  L[config.type](config.url, config.options);
      layer.addTo(this.map);
      return layer;
   }
}

function decorateLeaflet(config) {
   icons = config.materialIcons.reduce((accumulator, element) => {
      accumulator[element.name] = L.IconMaterial.icon(element)
      return accumulator;
   }, {});



   L.geoJSONUrl = function(url, options = {}) {
      options.onEachFeature = onEachFeature;
      options.pointToLayer = pointToLayer;

      let layer = L.geoJSON(null, options);
      startLoad(layer, url);

      return layer;
   }

   async function startLoad(layer, url) {
      let response = await fetch(url);
      let data = await response.json();

      layer.addData(data);
   }

   function onEachFeature(feature, layer) {
      // does this feature have a property named popupContent?
      if (feature.properties && feature.properties.description) {
          layer.bindPopup("<a target='wiki' href='" + feature.properties.href + "'>" + feature.properties.description + "</a> (" + (feature.properties.visited?"":"not ") + "visited)");
      }

      layer.on('mouseover', function() {
         layer.openPopup();
     });

     document.dispatchEvent(new CustomEvent("featureadded", {
               bubbles: true,
               detail: {
                  name: feature.properties.song,
                  layer: layer
               }
            }
         )
      );
     
  }

  function pointToLayer(feature, latlng) {
      var icon = icons[feature.properties.icon];
      return L.marker(latlng, {icon});
   }
}