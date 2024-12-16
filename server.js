import express from "express";
import config from "./lib/config.js";

const port = 3000;

run().then(() => console.log("Running"));

async function run() {
   var app = express();

   // serve static files
   //app.use(express.static("web"));

   // Typically, we take some npma installed caode and allow them through as static content.
   if(config.staticMappings) {
      config.staticMappings.forEach(map => {
         console.log(map)
         app.use(map.path, express.static(map.mapping));
      })
   }

   app.all('/template', async (req, res) => {
      res.status(200).send(config.gpsLogger.getTemplate.replace("${name}", req.query["job"]));
   });

   app.get('/elevationAtPoint',  async (req, res) => {
      console.log("PARAMS", req.query);
      try {
         let height = await elevation.get(+req.query.lat, +req.query.lng);
         res.status(200).send("" + height);
      } catch(e) {
         console.log(e)
         res.status(500).send("Whoops, were are the lat lng parameters.");
      }
   });

   app.listen(port, function (err) {
      console.log("running server on port " + port);
   });

   async function createJob(name) {
      return await job.create(name);
   }
}

function pad(num) {
   return num > 9 ? num : "0" + num;
}
