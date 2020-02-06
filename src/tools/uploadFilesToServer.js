//Videodateien auf Server uebertragen
//node .\uploadFilesToServer.js pw (= Dateien auf PW Pi laden)
//node .\uploadFilesToServer.js vb (= Dateien auf VB laden)
//node .\uploadFilesToServer.js marlen (= Dateien auf Marlen Player laden)

//Connection laden
const connection = require("./connection.js");

//Woher und wohin files hochgeladen?
const targetMachine = process.argv[2] || "pw";

//Dort liegen / dorthin kommen die Dateien
const localvideoDir = "C:/Users/Martin/Desktop/media/videoDone" + targetMachine.toUpperCase();
const remotevideoDir = "/media/usb_red/video";

console.log("upload video files from " + localvideoDir);
console.log("upload to server " + targetMachine + ": " + connection[targetMachine].host);

//Libs laden
const Client = require('ssh2-sftp-client');
const fs = require('fs-extra');
const glob = require("glob");
const path = require("path");

//Async Methode fuer Await Aufrufe
async function main() {

    //Ermitteln wohin die Video Dateien hochgeladen werden sollen, dazu ueber alle JSON-Configs gehen (janosch.json, bibi.json,...)
    console.log("get file infos from local json");
    const videoList = {};

    //JSON Assets dieser App durchgehen
    const files = glob.sync("../../src/assets/json/" + connection[targetMachine].assetId + "/*/*.json")
    for (const file of files) {

        //Ordner ermitteln wohin Dateien dieses Modes kommen: kinder/bibi-tina
        const folder = path.basename(path.dirname(file));
        const subfolder = path.basename(file, '.json');

        //Ueber Eintraege eines Modes gehen (z.B. bibi-tina.json) und Pfadinfo sammeln: "bibi-tina-papi-reiten" liegt unter "kinder/bibi-tina"
        const json = await fs.readJSON(file);
        for (album of json) {
            videoList[album.file] = folder + "/" + subfolder;
        }
    };

    //sftp-Verbindung um files hochzuladen
    console.log("connect sftp");
    const sftp = new Client();
    await sftp.connect({
        host: connection[targetMachine].host,
        port: '22',
        username: connection[targetMachine].user,
        password: connection[targetMachine].password
    });

    //Lokale Dateien ermitteln, die hochgeladen werden sollen
    console.log("get local video files to upload")
    const localFiles = await fs.readdir(localvideoDir);
    const filePromises = [];
    for (const localFileName of localFiles) {

        //Nur mp4-Dateien hochladen
        if (path.extname(localFileName).toLowerCase() === ".mp4") {

            //Lokalen Pfad bauen
            const localVideoFile = localvideoDir + "/" + localFileName;

            //Wo sollen die Datei auf Server liegen?
            const remotevideoPath = remotevideoDir + "/" + videoList[localFileName];

            //Verzichnis ggf. anlegen
            const dir_exists = await sftp.exists(remotevideoPath);
            if (!dir_exists) {
                console.log("create remote folder " + remotevideoPath);
                await sftp.mkdir(remotevideoPath, true);
            }

            //Jeder Upload als Promise, damit mehrere Uploads gleichzeitig laufen koennen
            console.log("upload " + localVideoFile + " to " + remotevideoPath);
            filePromises.push(sftp.fastPut(localVideoFile, remotevideoPath + "/" + localFileName));
        }

        //andere Dateiformate ignorieren
        else {
            console.log("ignore " + localFileName);
        }
    }

    //Warten bis alle Promises erfuellt sind (=alle Dateien hochgeladen wurden)
    await Promise.all(filePromises);

    //SFTP und Programm beenden
    console.log("upload done");
    await sftp.end();
    process.exit();
}

//Upload starten
main();