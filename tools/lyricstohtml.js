
import fs from "fs";

import config from "../lib/config.js";
let text_file = config.lyrics.input;
let out_file = config.lyrics.output;

const text = fs.readFileSync(text_file).toString();
let buffer = text.split("\n");

buffer.forEach(line => {
    console.log(escape(line));
});

//fs.writeFileSync(out_file, text, 'utf8');