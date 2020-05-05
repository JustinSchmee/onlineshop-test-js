import { Bestellung } from './Bestellung.js';


//Objekt Kontakt Konstruktor

export function Kontakt(eVorname, eNachname, eGuthaben, eGreditwuerdig) {
	/*
	
		@param eVorname: string
		@param eNachname: string
		@param eGuthaben: float
		@param eGreditwuerdig: boolean

	*/
	this.vorname = eVorname;
	this.nachname = eNachname;
	this.guthaben = eGuthaben;
	this.greditwuerdig = eGreditwuerdig;
	this.bestellungen = []; //Array wo Bestellungen abgelegt werden
	
	this.istGreditwuerdig = function() {
		return this.greditwuerdig;
	}
}