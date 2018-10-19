import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ResultfilterService } from './resultfilter.service';
import { ModeFilterPipe } from '../pipes/mode-filter.pipe';
import { SearchFilterPipe } from '../pipes/search-filter.pipe';
import { OrderByPipe } from '../pipes/order-by.pipe';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { JsondataService } from './jsondata.service';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class BackendService {

    //URL wo die Proxyskripte liegen aus config laden
    proxyUrl = environment.proxyUrl;

    //URL fuer WebSocketServer
    wssUrl = environment.wssUrl;

    //WebSocket
    socket: Subject<any>;

    //Komplette Itemliste wird nur 1 Mal geholt
    itemListFull;

    //Mode als Variable
    mode;

    //Mode-Filter (conni, heidi)
    modeFilter;

    //Suchefeld-Filter
    searchTerm;

    //sollen auch Tracks durchsucht werden
    searchIncludeTracks;

    //Sortierfeld
    orderField;

    //umgekehrte Reihenfolge
    reverseOrder;

    //Modus als BS, das abboniert werden kann
    modeBS = new BehaviorSubject("kinder");

    //gefilterte und sortierte Itemliste als BS, das abboniert werden kann
    itemListFilteredBS = new BehaviorSubject([]);

    //Liste der Mode Filter dieses Modus als BS, das abboniert werden kann
    modeFilterListSB = new BehaviorSubject([]);

    //Lautstaerke
    volume$: Subject<number> = new Subject<number>();

    //Zeit innerhalb items
    time$: Subject<string> = new Subject<string>();

    //Die Dateien, die gerade abgespielt werden
    files$: Subject<any[]> = new Subject<any[]>();

    //Die Gesamtspielzeit der Playlist, die gerade abgespielt werden
    filesTotalTime$: Subject<string> = new Subject<string>();

    //Aktueller Index in Titelliste
    position$: Subject<number> = new Subject<number>();

    //aktueller Pause-Zustand
    paused$: Subject<boolean> = new Subject<boolean>();

    //Anzahl der Sekunden bis Shutdown
    countdownTime$: Subject<number> = new Subject<number>();

    //wurde Server heruntergefahren?
    shutdown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    //Ist die App gerade mit dem WSS verbunden?
    connected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    //Services injekten
    constructor(private http: Http, private jds: JsondataService, private fs: ResultfilterService, private modeFilterPipe: ModeFilterPipe, private searchFilterPipe: SearchFilterPipe, private orderByPipe: OrderByPipe) {

        //WebSocket erstellen
        this.createWebsocket();
    }

    //Itemlist laden
    loadFullItemlist() {

        //Itemlist holen per HTTP-Request
        this.jds.loadJson().switchMap(fullList => {
            return fullList;
        }).subscribe(itemList => {

            //komplette Itemliste speichern
            this.itemListFull = itemList;

            //Wenn sich der Modus aendert
            this.modeBS.subscribe(mode => {

                //Modus in Variable speichern (fuer Start Playlist Funktion)
                this.mode = mode;

                //Filter-Modus-Liste des aktuellen Modus setzen
                this.modeFilterListSB.next(this.itemListFull[mode].filter);

                //gefilterte Itemliste erstellen
                this.filterItemList();
            });

            //Aenderungen an ModeFilter abbonieren, speichern und Itemliste neu erstellen
            this.fs.getModeFilter().subscribe(modeFilter => {
                this.modeFilter = modeFilter;
                this.filterItemList();
            });

            //Aenderungen an Suchterm abbonieren, speichern und Itemliste neu erstellen
            this.fs.getSearchTerm().subscribe(searchTerm => {
                this.searchTerm = searchTerm;
                this.filterItemList();
            });

            //Aenderungen an Track-Sichtbarkeit abbonieren, speichern und Itemliste neu erstellen
            this.fs.getShowTracks().subscribe(showTracks => {
                this.searchIncludeTracks = showTracks;
                this.filterItemList();
            });

            //Aenderungen an Sortierfeld abbonieren, speichern und Itemliste neu erstellen
            this.fs.getOrderField().subscribe(orderField => {
                this.orderField = orderField;
                this.filterItemList();
            });

            //Aenderungen an umgekehrter Sortierung abbonieren, speichern und Itemliste neu erstellen
            this.fs.getReverseOrder().subscribe(reverseOrder => {
                this.reverseOrder = reverseOrder;
                this.filterItemList();
            });
        });
    }

    //Wenn Modus / Filter / Sortierung angepasst wurde, muss Itemliste neu erstellt / gefiltert / sortiert werden
    filterItemList() {

        //Mode-Filter auf Items dieses Modus anwenden
        let filteredItemList = this.modeFilterPipe.transform(this.itemListFull[this.mode].items, this.modeFilter);

        //Suchfeld-Filter anwenden
        filteredItemList = this.searchFilterPipe.transform(filteredItemList, this.searchTerm, this.searchIncludeTracks);

        //Sortierung anwenden
        filteredItemList = this.orderByPipe.transform(filteredItemList, this.orderField, this.reverseOrder);

        //neue Itemliste in BS schieben
        this.itemListFilteredBS.next(filteredItemList);
    }

    //Verbindung zu WSS herstellen
    public createWebsocket() {

        //Socket-Verbindung mit URL aus Config anlegen
        let socket = new WebSocket(this.wssUrl);
        let observable = Observable.create(
            (observer: Observer<MessageEvent>) => {
                socket.onmessage = observer.next.bind(observer);
                socket.onerror = observer.error.bind(observer);
                socket.onclose = observer.complete.bind(observer);
                return socket.close.bind(socket);
            }
        );
        let observer = {
            next: (data: Object) => {

                //Wenn Verbindung zu WSS existiert
                if (socket.readyState === WebSocket.OPEN) {

                    //App ist mit WSS verbunden
                    this.connected$.next(true);

                    //Wenn es nicht nur ein Ping Message ist (die ggf. Verbindung wieder herstellt)
                    if (data["type"] !== "ping") {

                        //Nachricht an WSS schicken
                        socket.send(JSON.stringify(data));
                    }
                }

                //keine Verbindung zu WSS
                else {
                    //App ist nicht mit WSS verbunden
                    this.connected$.next(false);
                    //console.log("ready state ist " + socket.readyState);

                    //Verbindung zu WSS wieder herstellen                    
                    this.createWebsocket();
                }
            }
        };

        //WebSocket anlegen
        this.socket = Subject.create(observer, observable);

        //auf Nachrichten vom Server reagieren
        this.socket.subscribe(message => {

            //console.log((JSON.parse(message.data.toString())));
            let obj = JSON.parse(message.data);
            let value = obj.value;

            //Switch anhand Message-Types
            switch (obj.type) {
                case "change-volume":
                    this.volume$.next(value);
                    break;

                case "time":
                    this.time$.next(value);
                    break;

                case "set-position":
                    this.position$.next(value);
                    break;

                case "toggle-paused":
                    this.paused$.next(value);
                    break;

                case "set-files":
                    this.files$.next(value);
                    break;

                case "set-files-total-time":
                    this.filesTotalTime$.next(value);
                    break;

                case "set-countdown-time":
                    this.countdownTime$.next(value);
                    break;

                case "shutdown":
                    this.shutdown$.next(true);
                    break;
            }
        });
    }

    //Nachricht an WSS schicken
    sendMessage(messageObj) {
        //console.log(messageObj);
        this.socket.next(messageObj);
    }

    getMode() {
        return this.modeBS;
    }

    setMode(mode) {
        this.modeBS.next(mode);
    }

    getFilteredItemlist() {
        return this.itemListFilteredBS;
    }

    getModeFilterList() {
        return this.modeFilterListSB;
    }

    getVolume() {
        return this.volume$;
    }

    getTime() {
        return this.time$;
    }

    getFiles() {
        return this.files$;
    }

    getFilesTotalTime() {
        return this.filesTotalTime$;
    }

    getPosition() {
        return this.position$;
    }

    setPosition(position) {
        this.position$.next(position);
    }

    getPaused() {
        return this.paused$;
    }

    getCountdownTime() {
        return this.countdownTime$;
    }

    getShutdown() {
        return this.shutdown$;
    }

    getConnected() {
        return this.connected$;
    }
}