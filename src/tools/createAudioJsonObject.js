//libraries laden fuer Dateizugriff
const fs = require('fs-extra');
const path = require('path');
const mp3Duration = require('mp3-duration');

//Zeit Formattierung laden: [5, 13, 22] => 05:13:22
const timelite = require('timelite');

//Wo liegen die Dateien fuer die JSON Infos erzeugt werden sollen?
dataDir = "C:/Users/Martin/Desktop/media/done";

//lokale Items (z.B. Audio-Ordner) sammeln
outputArray = [];

//Infos per Promise holen und merken
const trackPromises = [];
tracks = [];
const durationPromises = [];
totalDuration = [];

//Ueber ueber filter-dirs des aktuellen modes gehen (hsp, kindermusik,...)
fs.readdirSync(dataDir).forEach(folder => {

    //Wenn es ein Ordner ist und nicht der copy-save Ordner
    let stat = fs.statSync(dataDir + "/" + folder);
    if (stat && stat.isDirectory() && folder !== "copy-save") {

        //JSON-Objekt fuer diese Folge erstellen
        outputArray[folder] = {
            "name": "",
            "file": folder,
            "active": true
        };

        //Ueber Tracks des Ordners gehen
        fs.readdir(dataDir + "/" + folder, (err, files) => {

            //Tracks sammeln und Gesamtdauer ermitteln
            tracks[folder] = [];
            totalDuration[folder] = 0;

            //Ueber Dateien gehen
            for (let file of files) {

                //nur mp3-Dateien sammeln
                if (path.extname(file).toLowerCase() === '.mp3') {

                    //Tracks per Promise sammeln
                    trackPromises.push(new Promise((resolve, reject) => {
                        if (err) {
                            reject(err.message);
                        }

                        //Tracks sammeln
                        tracks[folder].push(file);
                        resolve();
                    }));

                    //Gesamtlaenge ermitteln
                    durationPromises.push(new Promise((resolve, reject) => {

                        //mp3 Laenge ermitteln
                        mp3Duration(dataDir + "/" + folder + "/" + file, (err, duration) => {
                            if (err) {
                                reject(err.message);
                            }

                            //Laenge aufsummieren
                            totalDuration[folder] += duration;
                            resolve();
                        });
                    }));
                }
            }

            //warten bis alle Promises abgeschlossen sind
            Promise.all(durationPromises, trackPromises).then(() => {

                //Gesamtzeit als formattierten String. Zunaechst Float zu int: 13.4323 => 13
                let totalSeconds = Math.trunc(totalDuration[folder]);

                //Umrechung der Sekunden in [h, m, s] fuer formattierte Darstellung
                let hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = totalSeconds % 60;

                //h, m, s-Werte in Array packen
                let timeOutput = [hours, minutes, seconds];

                //[2,44,1] => 02:44:01
                let timeOutputString = timelite.str(timeOutput);

                //Laenge setzen
                outputArray[folder]["length"] = timeOutputString;

                //Tracks setzen
                outputArray[folder]["tracks"] = tracks[folder];

                //JSON-Objekt-Array ausgeben
                console.log(JSON.stringify(outputArray[folder], null, 2));
            }).catch((err) => {
                console.log('error:', err);
            });
        });
    }
});