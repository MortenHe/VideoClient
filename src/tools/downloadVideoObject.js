//Link laden
const link = require("./link.js");

//libraries laden fuer Dateizugriff
const fs = require('fs-extra');
const download = require('download');

//Benennung 003.ts um richtige Reihenfolge sicherzustellen
const padStart = require('lodash.padstart');

//Befehle auf Kommandzeile ausfuehren
const { execSync } = require('child_process');

//Wo sollen Videos gespeichert werden
const mediaDir = "C:/Users/Martin/Desktop/media";
const downloadDir = mediaDir + "/videoDownload";
const doneDir = mediaDir + "/videoDonePW";

//Dir anlegen, wo fertiges Video liegen soll, falls es nicht existiert
if (!fs.existsSync(doneDir)) {
    fs.mkdirSync(doneDir);
}

//Skript starten
main();

//Ueber Liste der files gehen, die heruntergeladen werden sollen
async function main() {
    for (video of link.urls) {
        await downloadVideo(video);
    }
}

//Video aus einzelnen Teilen herunterladen
async function downloadVideo(video) {
    console.log("downloading " + video[0]);

    //Url je nach Modus aufteilen, damit part-urls erzeugt werden koennen
    const urlSplit = {
        zdf: (video[1]).split(/segment\d{1,}/),
        wdr: (video[1]).split(/segment\d{1,}/),
        dm: (video[1]).split(/frag\(\d{1,}/)
    }[link.source];

    //Video-Promises sammeln
    videoPromises = [];

    //Download-Dir leeren
    fs.emptyDirSync(downloadDir);

    //Wie viele Segmente sollen fuer diesen Modus abgefragt werden
    const limit = {
        zdf: 165,
        wdr: 12,
        dm: 500
    }[link.source];

    //Einzelne Teile herunterladen
    for (let i = 1; i <= limit; i++) {

        //Videos-Promises sammeln
        videoPromises.push(new Promise((resolve, reject) => {

            //Url mit part-id erstellen fuer best. Modus
            let partUrl = {
                zdf: urlSplit[0] + "segment" + i + urlSplit[1],
                wdr: urlSplit[0] + "segment" + i + urlSplit[1],
                dm: urlSplit[0] + "frag(" + i + urlSplit[1]
            }[link.source];

            //Download
            download(partUrl).then(data => {

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
    await Promise.all(videoPromises);
    console.log("download done");

    //in Download-Verzeichnis gehen und ts Dateien zu einer ts-Datei zusammenfuehren
    execSync("cd " + downloadDir + " && copy /b *.ts joined_files.ts");
    console.log("putting single files together done");

    //ts-Datei nach mp4 konvertieren
    execSync("ffmpeg -loglevel panic -i " + downloadDir + "/joined_files.ts -acodec copy -vcodec copy " + doneDir + "/" + link.mode + "-" + video[0] + ".mp4");
    console.log("creating mp4 file done");

    //Download-Dir leeren
    fs.emptyDirSync(downloadDir);
    console.log("removing downloaded files done");
}