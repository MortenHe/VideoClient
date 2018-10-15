//Struktur eines Multimedia-Items (Video, Audio)
export class Item {
    mode: string;
    name: string;
    file: string;
    length: string;
    active: boolean;
    tracks: string[];
}

//subscribe innerhalb von subscribe
//unsubscribe
//track-Anzeige in neue Zeile bei kleiner Aufloesung
//Mode-Filter space-between mit media query