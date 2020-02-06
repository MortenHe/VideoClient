//Dateien und JSON auf Server hochladen und pruefen ob alle Dateien aus Config veruegbar sind
//Skript ruft einzelne Unterskripte auf
//node .\uploadDeployCompare.js pw | marlen | vb

//Auf welche Maschine sollen die Daten uebertragen werden?
const targetMachine = process.argv[2] || "pw";

//Skripte nacheinander ausfuehren
const execSync = require('child_process').execSync;
execSync("node uploadFilesToServer.js " + targetMachine, { stdio: 'inherit' });
execSync("node deployJsonToServer.js " + targetMachine, { stdio: 'inherit' });
execSync("node compareLocalJsonWithServer.js " + targetMachine, { stdio: 'inherit' });