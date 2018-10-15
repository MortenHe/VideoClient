//libraries laden fuer Dateizugriff
//ffprobe.exe muss vorhanden und im Path sein (z.B. im ffmpeg-bundle)
const fs = require('fs-extra')
const getDuration = require('get-video-duration');

//Zeit Formattierung laden: [5, 13, 22] => 05:13:22
const timelite = require('timelite');

//Wo liegen die Dateien fuer die JSON Infos erzeugt werden sollen?
const dataDir = "C:/Users/Martin/Desktop/media/done";
//const dataDir = "F:/Video (geschnitten)/Jahresvideo HWH + MH/2015 - Jahresvideo";
//2015, bibi-tina
const mode = "wizard";

//Benennung des Titels
naming = [];
naming["conni"] = "Conni - ";
naming["bibi-tina"] = "Bibi und Tina - ";
naming["2015"] = "2015-";

//Video-Infos sammeln
outputArray = [];

//Promises bei Laenge-Ermittlung sammeln
durationPromises = [];

//Dateien aus Video-Ordner holen
fs.readdir(dataDir, (err, files) => {

    //Ueber Dateien gehen
    for (let file of files) {

        //Wenn es eine Datei ist und zum aktuellen Modus gehoert
        let stat = fs.statSync(dataDir + "/" + file);
        if (stat && stat.isFile() && file.startsWith(mode)) {

            //Promises sammeln, da Zeit-Ermittlung asynchron laeuft
            durationPromises.push(new Promise((resolve, reject) => {

                //Laenge errechnen fuer Datei
                getDuration(dataDir + "/" + file).then((duration) => {

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
                    let timeOutputString = timelite.str(timeOutput);

                    //Name (z.B. Bibi und Tina - ) setzen, sofern in Config hinterlegt
                    let name = naming[mode] ? naming[mode] : " - ";

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

        //Video-Array ausgeben
        console.log(JSON.stringify(outputArray, null, 2));
    }).catch((err) => {
        console.log('error:', err);
    });
});