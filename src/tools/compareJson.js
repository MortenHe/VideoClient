//Connection laden
const connection = require("./connection.js");

//Je nach Ausfuerung lokale Werte mit pi oder vb vergleichen. Wenn kein Argument kommt -> pi
const runMode = process.argv[2] ? process.argv[2] : "pi";
console.log("compare local video files with " + runMode);

//Pfade wo die Videos liegen
const videoPath = "/media/pi/usb_red/video";

//libraries laden fuer Dateizugriff
const fs = require('fs-extra')
const path = require('path');

//lokale Items sammeln
itemsLocal = [];

//Ueber ueber filter-dirs des aktuellen modes gehen (hsp, kindermusik,...)
fs.readdirSync("../assets/json").forEach(folder => {

    //Wenn es ein dir ist
    if (fs.lstatSync("../assets/json/" + folder).isDirectory()) {

        //JSON-Files in diesem Dir auslesen
        fs.readdirSync("../assets/json/" + folder).forEach(file => {

            //modus in Variable speichern (bobo.json -> bobo)
            let mode = path.basename(file, ".json");

            //JSON-File einlesen
            const json = fs.readJsonSync("../assets/json/" + folder + "/" + file);

            //Ueber items (= Folgen) des JSON files gehen
            json.forEach(function (item) {

                //Pfad erstellen und merken .../hsp/bibi-tina/01-fohlen
                itemsLocal.push(videoPath + "/" + folder + "/" + mode + "/" + item.file)
            });
        });
    }
});

//SSH Verbindung aufbauen
var SSH2Promise = require('ssh2-promise');
var ssh = new SSH2Promise({
    host: connection[runMode].host,
    username: connection[runMode].user,
    password: connection[runMode].password
});

//SSH Session erzeugen
ssh.connect().then(() => {

    //Folder auf Server liefern
    ssh.exec("find " + videoPath + " -mindepth 3 -maxdepth 3 -type f").then((data) => {

        //Listen-String trimmen und Array erzeugen (Zeilenumbruch als Trenner)
        let itemsRemote = data.trim().split("\n");

        //Sets erzeugen fuer Vergleich der Werte
        let a = new Set(itemsRemote);
        let b = new Set(itemsLocal);

        //Welche Werte sind bei Server aber nicht in Config?
        let missingConfig = new Set([...a].filter(x => !b.has(x)));

        //Welche Werte sind in Config auf nicht auf Server?
        let missingServer = new Set([...b].filter(x => !a.has(x)));

        //Fehlende Werte in Config ausgeben
        for (let entry of missingConfig.entries()) {
            console.log("missing in config: " + entry[0].replace(videoPath + "/", ""));
        }

        //Fehlende Werte auf Server ausgeben
        for (let entry of missingServer.entries()) {
            console.log("missing on server: " + entry[0].replace(videoPath + "/", ""));
        }

        //Skript beenden
        process.exit();
    });
});