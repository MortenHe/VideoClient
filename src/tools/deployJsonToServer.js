//node .\deployJsonToServer.js pw pw (= PW JSON auf PW Pi laden)
//node .\deployJsonToServer.js marlen vb (= Marlen JSON auf VB laden)

//Connection laden
const connection = require("./connection.js");

//Welche JSON Files (pw vs. marlen) wohin deployen (pw / marlen / vb)
const appId = process.argv[2] || "pw";
const targetMachine = process.argv[3] || "pw";
console.log("deploy audio json (" + appId + ") to server " + targetMachine);

//Unter welchem Unterpfad wird die App auf dem Server laufen?
const base_href = "wvp";

//Asset Ordner mit JSON files kopieren
const fs = require('fs-extra');
fs.removeSync("../../myAssets/assets");
fs.copySync("../assets", "../../myAssets/assets");

//Assets (=JSON-Configs) loeschen, die nicht zu dieser App gehoeren (z.B. json von marlen loeschen, wenn pw json deployed wird)
fs.readdirSync("../../myAssets/assets/json").forEach(folder => {
    if (folder !== appId) {
        console.log("delete assets from app " + folder);
        fs.removeSync("../../myAssets/assets/json/" + folder);
    }
});

//JSON-Folder zippen
const zipFolder = require('zip-folder');
console.log("zip json data");
zipFolder('../../MyAssets', '../../myJson.zip', function (err) { });

//Pfad wo Dateien auf Server liegen sollen
let server_audio_path = "/var/www/html/" + base_href;

//SSH-Verbindung um Shell-Befehle auszufuehren (unzip, chmod,...)
const SSH2Promise = require('ssh2-promise');
const ssh = new SSH2Promise({
    host: connection[targetMachine].host,
    username: connection[targetMachine].user,
    password: connection[targetMachine].password
});

//sftp-Verbindung um Webseiten-Dateien hochzuladen
const Client = require('ssh2-sftp-client');
const sftp = new Client();
sftp.connect({
    host: connection[targetMachine].host,
    port: '22',
    username: connection[targetMachine].user,
    password: connection[targetMachine].password
}).then(() => {

    //assets Ordner loeschen
    console.log("delete folder " + server_audio_path + "/assets");
    return sftp.rmdir(server_audio_path + "/assets", true);
}).then(() => {

    //gezippte JSON-files hochladen
    console.log("upload json zip file");
    return sftp.fastPut("../../myJson.zip", server_audio_path + "/myJson.zip");
}).then(() => {

    //per SSH verbinden, damit Shell-Befehle ausgefuehrt werden koennen
    console.log("connect via ssh");
    return ssh.connect();
}).then(() => {

    //JSON-Daten entzippen
    console.log("unzip json file");
    return ssh.exec("cd " + server_audio_path + " && unzip myJson.zip");
}).then(() => {

    //Zip-File loeschen
    console.log("delete zip file");
    return sftp.delete(server_audio_path + "/myJson.zip");
}).then(() => {

    //Rechte anpassen, damit Daten in Webseite geladen werden koennen
    console.log("chmod 0777");
    return ssh.exec("chmod -R 0777 /var/www/html");
}).then(() => {

    //Programm beenden
    console.log("build process done");
    sftp.end();
    process.exit();
}).catch((err) => {
    console.log(err);
});