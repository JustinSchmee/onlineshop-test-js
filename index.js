// Import stylesheets
import './style.css'

import { Kontakt } from './Kontakt.js'; //Importieren des Kontakt Objekts
import { Bestellung } from './Bestellung.js'; //Importieren des Bestellung Objekts



const msgDiv = document.getElementById("msg"); //Eine HTML-Element das für das Anzeigen von Meldungen verwendet werden kann msgDiv.textContent = ""
const kundenForm = document.getElementById("kundenForm"); //Ein HTML Formular mit den Feldern für Kunden
const bestellungForm = document.getElementById("bestellungForm"); 
const kundenFormField = document.getElementById("kundenFormField");//Ein HTML Feld welches Elemente gruppert.
const bestellungFormField = document.getElementById("bestellungFormField");

var kontakte = []; //Hier werden die Gespeicherten Kontakte der Sitzung abgelegt.

const neuBtn = document.getElementById("neuerKundeBtn");
neuBtn.addEventListener("click", () => { 

  kontakte = []; // Kontaktliste wird durch leeres Array ersetzt
  msgDiv.innerText = "Bitte legen sie einen neuen Kunden an."; //Text in das HTML-Element schreiben
	kundenForm.reset(); //Entfernt den Text aller felder in der Kunden Form
	kundenFormField.disabled = false; // Veränderbarkeit der Elemente in der Gruppierung verbieten.
	bestellungFormField.disabled = true; //Veränderbarkeit der Elemente in der Gruppierung erlauben.

});

const loeschenBtn = document.getElementById("loeschenBtn");
loeschenBtn.addEventListener("click", () => {
  
  kontakte = []; //Kontaktliste mit einem leeren Array ersetzen.
  msgDiv.innerText = "Alle aktiven Daten des Programms wurden gelöscht.";
  kundenForm.reset();
  bestellungForm.reset();
  kundenFormField.disabled = false; //Kundenform beschreibbar
  bestellungFormField.disabled = true; //Bestellungform nicht beschreibbar
});

//Kunden anlegen
kundenForm.onsubmit = ((e) => {
  //Hier wird der "Speichern"-Button ausgeführt
  
  
  //************ Alter Code - Entfernt *******
  //const nachname = kundenForm.nachname.value; //Feldwerte können aus dem Formular abgeholt werden
  //***********************************
  
  var kontaktAuswahl = Object.create(	//Neues Objekt erstellen und auf Variable ablegen.
	new Kontakt(kundenForm.vorname.value, //Abruf und initialisieren des Kontakt Objekts
		kundenForm.nachname.value, 
		parseFloat(kundenForm.guthaben.value), //Umwandlung des Guthaben in Textform zu einem Float
		kundenForm.kreditwuerdig.checked) 
  );	//Kontakt wurde initialisiert


  kontakte.push(kontaktAuswahl); //push(e) fügt der Liste ein Element e hinzu.
  msgDiv.innerText = "Kontakt: " + kontaktAuswahl.vorname + " " + kontaktAuswahl.nachname + " wurde gespeichert und hinterlegt.";
  kundenFormField.disabled = true;	//Kundenform nicht beschreibbar
  bestellungFormField.disabled = false; //Bestellungform beschreibbar
  
  
  //************ Alter Debug Code *******
  //console.log(kontaktAuswahl.istGreditwuerdig());
  //console.log(kontaktAuswahl.vorname);
  //console.log(kontaktAuswahl.istGreditwuerdig());
  //console.log(kontakte.length);
  //**************************************
  
  // "false" Verhindert, dass die Seite neu geladen wird.
  return false;
});



//Bestellung hinzufügen
bestellungForm.onsubmit = ((e) => {
  //Hier wird der "Hinzufügen"-Button ausgeführt
  
  if(kontakte.length == 0){ //Wenn kein Kontakt bisher erstellt ist
	  msgDiv.innerHTML = "Sie müssen zuerst ein Kontakt anlegen, bevor<br/>Sie eine Bestellung hinzufügen können.";
	  return false; 	  //Abbruch der Methode, false Verhindert, dass die Seite neu geladen wird.
  }
  
  var letzterKontakt = kontakte[kontakte.length-1]; //kontakte.length-1 = die Position des zuletzt hinzugefügten Kontakt. -> Auswahl dessen aus kontakt[x]

  
  var bestellungNeu = Object.create( //Neues Objekt erstellen und auf Variable ablegen.
	new Bestellung(bestellungForm.beschreibung.value, //Abruf und initialisieren des Bestellung Objekts
		parseFloat(bestellungForm.betrag.value)) //Umwandlung des Betrags in Textform zu einem Float
  );
  
  if (bestellungNeu.betrag < 0){
    msgDiv.innerText = "Der Bestellungs Betrag darf nicht Negativ sein";
    return;
  }
  
  
  var zahlungsBetrag = (rechneGesamtBetrag() + bestellungNeu.betrag); //Berechnet aus vorherigen Bestellungen und dem Betrag von dem welches neu hinzugefügt werden soll
  
  
  
  if(letzterKontakt.guthaben >= zahlungsBetrag){ //Wenn das Guthaben des Kontaktes ausreicht den zusätzlichen Zahlungsbetrag zu begleichen.
	  msgDiv.innerText = "Bestellung: " + bestellungNeu.beschreibung + ", wurde Kontakt: " + letzterKontakt.vorname + " " + letzterKontakt.nachname + ", hinterlegt.";
	  letzterKontakt.bestellungen.push(bestellungNeu); //Dem Bestellungs Array des Kontaktes wird die neue Bestellung hinzugefügt.

  }
  
  
  //Wenn das Guthaben des Kontaktes nicht ausreicht den zusätzlichen Zahlungsbetrag zu begleichen und der Kontakt aber Greditwürdig ist.
  else if((letzterKontakt.guthaben < (rechneGesamtBetrag() + bestellungNeu.betrag)) && letzterKontakt.istGreditwuerdig ()){
	  var kreditBelastung = (rechneGesamtBetrag() + bestellungNeu.betrag) - letzterKontakt.guthaben; //Berechnet sich aus dem Gesamt Bestellungs Betrag - dem Guthaben
	  msgDiv.innerHTML = "Bestellung: " + bestellungNeu.beschreibung + ", wurde Kontakt: " + letzterKontakt.vorname + " " + letzterKontakt.nachname + ", hinterlegt." +
	  "<br />Die Kreditbelastung beträgt: " + kreditBelastung + "€"; //Fügt in das Element HTML Code ein.
	  letzterKontakt.bestellungen.push(bestellungNeu); 

  }
  else { //Wenn das Guthaben des Kontaktes nicht ausreicht und er auch nicht Greditwürdig ist.
	
	msgDiv.innerHTML = "Bestellung von Kontakt: " + letzterKontakt.vorname + " " + letzterKontakt.nachname + ", <br/>konnte nicht hinzugefügt werden, da er nicht Kreditwürdig ist und sein Guthaben erschöpft ist.";

	  
  }
  
  
  bestellungForm.reset(); //Bestellungs Formular Felder leeren.
  
  // false Verhindert, dass die Seite neu geladen wird.
  return false;
});

function rechneGesamtBetrag(){ //Allgemeine Funktion zum aufsummieren des Betrags der abgelegten Bestellungen
	
	var letzterKontakt = kontakte[kontakte.length-1];
	var bestellungen = letzterKontakt.bestellungen; //Bestellungen des letzten Kontaktes werden auf Variable verlinkt
	
	
	if(bestellungen.length < 1) //Wenn dem Kontakt keine Bestellungen abgelegt wurden
		return 0; //Dann gebe einen Betrag von 0 zurück
	
	var gesamtBetrag = 0; // Variable zur Berechnung des Gesamt Betrag
	var index = 0; //Index Variable als Zähler
	
	for(; index<bestellungen.length; index++){ //For Schleife zum durchlaufen aller Bestellungen
		gesamtBetrag = gesamtBetrag + parseInt(bestellungen[index].betrag); //Addieren des gesamtBetrags mit dem aktuell ausgewählten Betrags
	}
	return gesamtBetrag; //Gesamtbetrag aller durchlaufener Bestellungen 
	
}

//Summieren
const sumBtn = document.getElementById("sumBtn");
sumBtn.addEventListener("click", () => {
	if(kontakte.length == 0){ //Wenn noch kein Kontakt angelegt wurde wird der Vorgang abgebrochen.
        msgDiv.innerHTML = "Sie müssen erst Kontakte anlegen und diesen Bestellungen zuordnen,<br/>bevor sie die Beträge Summieren können."
    	return false;
    }

	var letzterKontakt = kontakte[kontakte.length-1]; //letzten Kontakt auswählen
	var bestellungen = letzterKontakt.bestellungen;
	
	var betrag = rechneGesamtBetrag(); //Abruf des gesamtbetrags
	msgDiv.innerText = "Kontakt: " + letzterKontakt.vorname + " " + letzterKontakt.nachname + ", hat " + bestellungen.length + " Bestellungen. Im Wert von " + betrag + " €.";

	
});