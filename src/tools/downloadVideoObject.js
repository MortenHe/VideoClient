//libraries laden fuer Dateizugriff
const fs = require('fs-extra');
const download = require('download');

//Benennung 003.ts um richtige Reihenfolge sicherzustellen
const padStart = require('lodash.padstart');

//Befehle auf Kommandzeile ausfuehren
const { execSync } = require('child_process');

//Wo sollen Videos gespeichert werden
const downloadDir = "C:/Users/Martin/Desktop/media/down";

//Praefix fuer Dateiname (conni, bibi-tina)
const mode = "bibi-tina";

//Dateiname der mp4-Datei (baustelle, zirkuspony)
const name = "";

//Video-Promises sammeln
videoPromises = [];

//Download-Dir leeren
fs.emptyDirSync(downloadDir);

//Einzelne Teile herunterladen
for (let i = 1; i <= 155; i++) {

    //Link mit passendem Segment-Identifier
    link = "";

    //Videos-Promises sammeln
    videoPromises.push(new Promise((resolve, reject) => {

        //Download
        download(link).then(data => {

            //Datei speichern
            fs.writeFileSync(downloadDir + "/" + padStart(i, 3, "0") + ".ts", data);
            resolve();
        }, err => {

            //Bei Fehler trotzdem resolven
            console.log(err.statusCode);
            resolve();
        });
    }));
}

//Wenn alle Dateien heruntergeladen wurden
Promise.all(videoPromises).then(() => {
    console.log("download done");

    //in Download-Verzeichnis gehen und ts Dateien zu einer ts-Datei zusammenfuehren
    execSync("cd " + downloadDir + " && copy /b *.ts joined_files.ts");
    console.log("putting single files together done");

    //ts-Datei nach mp4 konvertieren
    execSync("ffmpeg -i " + downloadDir + "/joined_files.ts -acodec copy -vcodec copy " + downloadDir + "/../done/" + mode + "-" + name + ".mp4");
    console.log("creating mp4 file done")
});