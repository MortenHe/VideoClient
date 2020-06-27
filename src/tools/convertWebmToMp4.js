//webm-Dateien mit ffmpeg in mp4 umwandeln

//libs
const glob = require('glob');
const path = require('path');
const { execSync } = require('child_process');

//Ueber webm-Dateien gehehn und im mp4 umwandeln
const dataDir = require("./link.js").mediaDir;
glob(dataDir + "/*.webm", (err, files) => {
    for (const inputPath of files) {
        const outputPath = dataDir + "/" + path.basename(inputPath, '.webm') + ".mp4";
        execSync("ffmpeg -i " + inputPath + " " + outputPath);
    }
});