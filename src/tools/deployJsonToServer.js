//Nur JSON-Config auf Server uebertragen
//node .\deployJsonToServer.js pw pw (= PW JSON auf PW Pi laden)
//node .\deployJsonToServer.js marlen vb (= Marlen JSON auf VB laden)

//Async Methode fuer Await Aufrufe
async function main() {

    //Connection laden
    const connection = require("./connection.js");

    //Welche JSON Files (pw vs. marlen) wohin deployen (pw / marlen / vb)
    const appId = process.argv[2] || "pw";
    const targetMachine = process.argv[3] || "pw";
    console.log("deploy video json (" + appId + ") to server " + targetMachine + ": " + connection[targetMachine].host);

    //Unter welchem Unterpfad wird die App auf dem Server laufen?
    const base_href = "wvp";

    //Pfad wo Dateien auf Server liegen sollen
    let server_video_path = "/var/www/html/" + base_href;

    //Asset Ordner mit JSON files kopieren
    const fs = require('fs-extra');

    //alte lokale Assets entfernen
    console.log("remove old assets");
    await fs.remove("../../myAssets/assets");

    //neue Assets kopieren
    console.log("copy new assets");
    await fs.copy("../assets", "../../myAssets/assets");

    //Assets (=JSON-Configs) loeschen, die nicht zu dieser App gehoeren (z.B. json von marlen loeschen, wenn pw json deployed wird)
    console.log("delete other JSON-configs");
    const folders = await fs.readdir("../../myAssets/assets/json")
    for (const folder of folders) {
        if (folder !== appId) {
            console.log("delete assets from app " + folder);
            await fs.remove("../../myAssets/assets/json/" + folder);
        }
    }

    //JSON-Folder zippen
    const zipFolder = require('zip-a-folder');
    console.log("zip json data");
    await zipFolder.zip('../../MyAssets', '../../myJson.zip');

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
    await sftp.connect({
        host: connection[targetMachine].host,
        port: '22',
        username: connection[targetMachine].user,
        password: connection[targetMachine].password
    });

    //assets Ordner loeschen
    console.log("delete folder " + server_video_path + "/assets");
    await sftp.rmdir(server_video_path + "/assets", true);

    //gezippte JSON-files hochladen
    console.log("upload json zip file");
    await sftp.fastPut("../../myJson.zip", server_video_path + "/myJson.zip");

    //per SSH verbinden, damit Shell-Befehle ausgefuehrt werden koennen
    console.log("connect via ssh");
    await ssh.connect();

    //JSON-Daten entzippen
    console.log("unzip json file");
    await ssh.exec("cd " + server_video_path + " && unzip myJson.zip");

    //Zip-File loeschen
    console.log("delete zip file");
    await sftp.delete(server_video_path + "/myJson.zip");

    //Rechte anpassen, damit Daten in Webseite geladen werden koennen
    console.log("chmod 0777");
    await ssh.exec("chmod -R 0777 /var/www/html");

    //Programm beenden
    console.log("build process done");
    await sftp.end();
    process.exit();
}

//Deployment starten
main();