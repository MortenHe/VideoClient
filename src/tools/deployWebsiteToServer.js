//Webseite bauen und auf Server laden
//node .\deployWebsiteToServer.js pw pw (= PW Webseite auf PW Pi laden)
//node .\deployWebsiteToServer.js marlen vb (= Marlen Webseite auf VB laden)

//Async Methode fuer Await Aufrufe
async function main() {

    //Connection laden
    const connection = require("./connection.js");

    //Welche Website (pw vs. marlen) wohin deployen (pw / marlen / vb)
    const appId = process.argv[2] || "pw";
    const targetMachine = process.argv[3] || "pw";
    console.log("build and deploy video (" + appId + ") to server " + targetMachine);

    //Unter welchem Unterpfad wird die App auf dem Server laufen?
    const base_href = "wvp";

    //Pfad wo Webseiten-Dateien auf Server liegen sollen
    let server_video_path = "/var/www/html/" + base_href;

    //Projekt bauen
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    console.log("start build");
    await exec("ng build -c=" + appId + " --base-href=/" + base_href + "/");
    console.log("build done");

    //Assets (=JSON-Configs) loeschen, die nicht zu dieser App gehoeren
    const fs = require('fs-extra');
    console.log("delete other JSON-configs");
    const folders = await fs.readdir("../assets/json");
    folders.forEach(folder => {
        if (folder !== appId && appId !== 'vb') {
            console.log("delete assets from app " + folder);
            fs.removeSync("../../dist/assets/json/" + folder);
        }
    });

    //htaccess Schablone in dist Ordner kopieren und durch Pattern Ersetzung anpassen
    const replace = require("replace");
    console.log("copy htacces");
    await fs.copy('.htaccess', '../../dist/htaccess');

    console.log("update htacces");
    await replace({
        regex: "###PATH###",
        replacement: base_href,
        paths: ['../../dist/htaccess'],
        recursive: true,
        silent: true
    });

    //JSON-Folder zippen
    const zipFolder = require('zip-a-folder');
    console.log("zip data");
    await zipFolder.zip('../../dist', '../../myDist.zip')

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

    //gibt es schon einen Ordner (wvp)
    console.log("check if exists: " + server_video_path)
    const dir_exists = await sftp.exists(server_video_path);

    //Wenn Ordner (wvp) existiert, diesen rekursiv loeschen
    if (dir_exists) {
        console.log("delete folder " + server_video_path);
        await sftp.rmdir(server_video_path, true);
    }

    //neuen Ordner (wvp) anlegen
    console.log("create folder " + server_video_path);
    await sftp.mkdir(server_video_path);

    //gezippten Webseiten-Code hochladen
    console.log("upload zip file");
    await sftp.fastPut("../../myDist.zip", server_video_path + "/myDist.zip");

    //per SSH verbinden, damit Shell-Befehle ausgefuehrt werden koennen
    console.log("connect via ssh");
    await ssh.connect();

    //Webseiten-Code entzippen
    console.log("unzip file");
    await ssh.exec("cd " + server_video_path + " && unzip myDist.zip");

    //htaccess file umbenennen (htaccess -> .htaccess)
    console.log("rename htaccess file");
    await ssh.exec("mv " + server_video_path + "/htaccess " + server_video_path + "/.htaccess")

    //Zip-File loeschen
    console.log("delete zip file");
    await sftp.delete(server_video_path + "/myDist.zip");

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