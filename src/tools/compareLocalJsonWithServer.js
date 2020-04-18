//Lokales JSON mit Dateien auf Server vergleichen
//node .\compareLocalJsonWithServer.js pw | marlen | vb | laila

//Connection laden
const connection = require("./connection.js");

//welche assets (pw vs. marlen) vergleichen auf welcher Maschine (pw / marlen / vb) 
const targetMachine = process.argv[2] || "pw";

//versch. environments koennen gemeinsame assets nutzen
const assetsId = connection[targetMachine].assetId;
console.log("compare local json files (" + assetsId + ") with remote server (" + targetMachine + "): " + connection[targetMachine].host);

//libraries laden fuer Dateizugriff
const fs = require('fs-extra')
const path = require('path');

//Pfade wo die Dateien liegen auf Server
const config = fs.readJSONSync("config.json");
const remoteVideoDir = config["remoteVideoDir"];

//lokale Items (z.B. video-Ordner) sammeln
itemsLocal = [];

//Ueber ueber filter-dirs des aktuellen modes gehen (hsp, kindermusik,...)
fs.readdirSync(config["localJsonDir"] + "/" + assetsId).forEach(folder => {

    //Wenn es ein dir ist
    if (fs.lstatSync(config["localJsonDir"] + "/" + assetsId + "/" + folder).isDirectory()) {

        //JSON-Files in diesem Dir auslesen
        fs.readdirSync(config["localJsonDir"] + "/" + assetsId + "/" + folder).forEach(file => {

            //modus in Variable speichern (bobo.json -> bobo)
            let mode = path.basename(file, ".json");

            //JSON-File einlesen
            const json = fs.readJsonSync(config["localJsonDir"] + "/" + assetsId + "/" + folder + "/" + file);

            //Ueber items (= Folgen) des JSON files gehen
            json.forEach(function (item) {

                //Pfad erstellen und merken .../hsp/bibi-tina/01-fohlen
                itemsLocal.push(remoteVideoDir + "/" + folder + "/" + mode + "/" + item.file)
            });
        });
    }
});

//SSH Verbindung aufbauen
var SSH2Promise = require('ssh2-promise');
var ssh = new SSH2Promise({
    host: connection[targetMachine].host,
    username: connection[targetMachine].user,
    password: connection[targetMachine].password
});

//SSH Session erzeugen
ssh.connect().then(() => {

    //Files auf Server liefern
    ssh.exec("find " + remoteVideoDir + " -mindepth 3 -maxdepth 3 -type f").then((data) => {

        //Listen-String trimmen und Array erzeugen (Zeilenumbruch als Trenner)
        const itemsRemote = data.trim().split("\n");

        //Sets erzeugen fuer Vergleich der Werte
        const a = new Set(itemsRemote);
        const b = new Set(itemsLocal);

        //Welche Werte sind bei Server aber nicht in Config?
        const missingConfig = new Set([...a].filter(x => !b.has(x)));

        //Welche Werte sind in Config auf nicht auf Server?
        const missingServer = new Set([...b].filter(x => !a.has(x)));

        //Fehlende Werte in Config ausgeben
        for (const entry of missingConfig.entries()) {
            console.log("missing in config: " + entry[0].replace(remoteVideoDir + "/", ""));
        }

        //Fehlende Werte auf Server ausgeben
        for (const entry of missingServer.entries()) {
            console.log("missing on server: " + entry[0].replace(remoteVideoDir + "/", ""));
        }

        //Skript beenden
        process.exit();
    });
});