
//Objekt Bestellung Konstruktor


export function Bestellung(eBeschreibung, eBetrag) {
	this.beschreibung = eBeschreibung;
	this.betrag = eBetrag;
	
	
	this.gebeBetrag = function() {
		return this.betrag;
	}
	
}