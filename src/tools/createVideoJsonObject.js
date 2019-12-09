//Modus laden
const link = require("./link.js");

//libraries laden fuer Dateizugriff
//ffprobe.exe muss vorhanden und im Path sein (z.B. im ffmpeg-bundle)
const fs = require('fs-extra')
const { getVideoDurationInSeconds } = require('get-video-duration')

//Zeit Formattierung laden: [5, 13, 22] => 05:13:22
const timelite = require('timelite');

//Wo liegen die Dateien fuer die JSON Infos erzeugt werden sollen?
const dataDir = "C:/Users/Martin/Desktop/media/done";
//const dataDir = "F:/Video (geschnitten)/Jahresvideo HWH + MH/2015 - Jahresvideo";
//const dataDir = "F:/";

//Benennung des Titels
naming = [];
naming["conni"] = "Conni - ";
naming["bibi"] = "Bibi Blocksberg - ";
naming["bibi-tina"] = "Bibi und Tina - ";
naming["maus"] = "Die Maus - ";
naming["2015"] = "2015-";
naming["2016"] = "2016-";
naming["2017"] = "2017-";
naming["2018"] = "2018-";
naming["2019"] = "2019-";
naming["pippi"] = "Pippi - ";
naming["pumuckl"] = "Pumuckl - ";

//Video-Infos sammeln
outputArray = [];

//Promises bei Laenge-Ermittlung sammeln
durationPromises = [];

//Dateien aus Video-Ordner holen
fs.readdir(dataDir, (err, files) => {

    //Ueber Dateien gehen
    for (let file of files) {

        //Unsichtbare Datei uebergehen
        if (file === "System Volume Information") {
            continue;
        }

        //Wenn es eine Datei ist und zum aktuellen Modus gehoert
        let stat = fs.statSync(dataDir + "/" + file);
        if (stat && stat.isFile() && file.startsWith(link.mode)) {

            //Promises sammeln, da Zeit-Ermittlung asynchron laeuft
            durationPromises.push(new Promise((resolve, reject) => {

                //Laenge errechnen fuer Datei
                getVideoDurationInSeconds(dataDir + "/" + file).then((duration) => {

                    //Gesamtzeit als formattierten String. Zunaechst Float zu int: 13.4323 => 13
                    let totalSeconds = Math.trunc(duration);

                    //Umrechung der Sekunden in [h, m, s] fuer formattierte Darstellung
                    let hours = Math.floor(totalSeconds / 3600);
                    totalSeconds %= 3600;
                    let minutes = Math.floor(totalSeconds / 60);
                    let seconds = totalSeconds % 60;

                    //h, m, s-Werte in Array packen
                    let timeOutput = [hours, minutes, seconds];

                    //[2,44,1] => 02:44:01
                    let timeOutputString = timelite.time.str(timeOutput);

                    //bibi-mamis-neuer-besen.mp4 -> mamis-neuer-besen
                    let name = file.replace(link.mode + "-", "");
                    name = name.replace(".mp4", "");

                    //mamis-neuer-besen -> mamis neuer besen
                    name = name.replace(/-/g, ' ');

                    //mamis neuer besen -> Bibi Blocksberg - mamis neuer besen
                    name = naming[link.mode] ? naming[link.mode] + name : " - ";

                    //Bibi Blocksberg - mamis neuer besen -> Bibi Blocksberg - Mamis Neuer Besen
                    name = name.replace(/\b[a-z]/g, (chr) => {
                        return chr.toUpperCase();
                    });

                    //Video-Objekt erstellen und sammeln
                    outputArray.push({
                        "name": name,
                        "file": file,
                        "length": timeOutputString,
                        "active": true
                    });
                    resolve();
                });
            }));
        }
    }

    //warten bis alle Promises abgeschlossen sind
    Promise.all(durationPromises).then(() => {

        //Liste nach Dateiname (pippi-01-fest.avi, pippi-02-freunde.avi) sortieren, da Promises unterschiedlich schnell zureuckkommen koennen
        outputArray.sort((a, b) => a.file.localeCompare(b.file));

        //Video-Array ausgeben
        console.log(JSON.stringify(outputArray, null, 2));
    }).catch((err) => {
        console.log('error:', err);
    });
});