# WasserTracker – erste PWA-Version

## Funktionen
- 12 Stundenabschnitte 08:00–09:00 bis 19:00–20:00
- Pro Abschnitt „Ja“ (= mindestens 200 ml) oder „Nein“ (= weniger als 200 ml)
- Erneutes Tippen auf die ausgewählte Antwort setzt sie auf „Offen“ zurück
- Tagesfortschritt und Statistik der letzten sieben Kalendertage
- Speicherung im lokalen Browser-Speicher; offline nutzbar nach erstmaligem Laden über HTTP(S)

**Noch nicht enthalten:** automatische Erinnerungen, Push-Nachrichten, Cloud-Synchronisierung oder genaue Trinkmengen. Die 12 Zeitfenster sind die Bezugsstunden, keine bereits implementierten Benachrichtigungen.

## Unter Windows starten
1. ZIP entpacken.
2. Python installieren, falls noch nicht vorhanden.
3. Im entpackten Ordner `WasserTracker` ein Terminal öffnen.
4. `python -m http.server 8000` ausführen (alternativ `py -m http.server 8000`).
5. Im Browser `http://localhost:8000` öffnen.

Für einen schnellen Test funktioniert auch ein Doppelklick auf `index.html`; die PWA-/Offline-Funktionen brauchen aber HTTP(S).

## Auf dem iPhone installieren
Die App muss auf einer **HTTPS-Webadresse** bereitgestellt werden (z. B. über einen geeigneten statischen Hostingdienst). Eine nur auf dem Windows-PC unter `localhost` laufende Seite ist auf dem iPhone nicht erreichbar. Öffne die HTTPS-Adresse in Safari, tippe auf Teilen und wähle „Zum Home-Bildschirm“ (ggf. „Als Web-App öffnen“).

**Achtung:** Die Daten liegen nur im Speicher der jeweiligen Browser-/App-Installation. Das iPhone übernimmt keine Einträge vom Windows-PC. Browserdaten löschen oder die App entfernen kann die Einträge löschen. Keine sensiblen Daten eingeben.

## Projektdateien
`index.html` Oberfläche; `style.css` Gestaltung; `app.js` Logik und Speicherung; `manifest.webmanifest` Installation; `sw.js` Offline-Cache; `icon-*.png` App-Symbole.

## Neu in Version 1.1: Tagesziel 1,5 Liter

Die Tagesübersicht zeigt den Fortschritt bis zum Tagesziel. Nach acht Ja-Antworten erscheint eine Erfolgsmeldung. Jede Ja-Antwort bestätigt **mindestens** 200 ml; acht Antworten bedeuten daher **mindestens 1,6 Liter** und belegen das Erreichen des 1,5-Liter-Ziels. Sieben Ja-Antworten (mindestens 1,4 Liter) genügen dafür nicht sicher. Die Wochenstatistik markiert erreichte Tagesziele mit ★. Antworten können weiterhin korrigiert werden; bei weniger als acht Ja-Antworten verschwindet die Erfolgsmeldung wieder. Bereits gespeicherte Daten bleiben erhalten.

## Neu in Version 1.2: Tagesmedaillen
In der Wochenstatistik wird jeder der letzten sieben Tage mit einer goldenen Medaille ausgezeichnet, sobald mindestens acht Ja-Antworten erfasst sind. Daneben zeigt die App die Zahl der erfolgreichen Tage der letzten sieben Kalendertage. Nachträgliche Korrekturen aktualisieren die Auszeichnungen automatisch.

## Kostenlos mit GitHub Pages auf dem iPhone bereitstellen
1. Erstelle auf github.com ein kostenloses Konto (falls nicht vorhanden).
2. Erstelle über **New repository** ein neues **öffentliches** Repository, z. B. `wassertracker`. Öffentliche Repositories und Pages-Webseiten sind öffentlich einsehbar. Keine privaten Trinkdaten hochladen; diese liegen ohnehin nur lokal im Browser.
3. Klicke im Repository auf **Add file → Upload files**. Lade **alle Dateien aus dem entpackten WasserTracker-Ordner direkt ins Hauptverzeichnis** hoch (nicht den Ordner selbst und nicht die ZIP-Datei). Bestätige mit **Commit changes**.
4. Gehe zu **Settings → Pages**. Wähle unter **Build and deployment** die Quelle **Deploy from a branch**, dann Branch **main**, Ordner **/(root)**, und speichere.
5. Nach Veröffentlichung zeigt GitHub Pages eine Adresse nach dem Muster `https://DEINNAME.github.io/wassertracker/`. Die tatsächliche Adresse findest du unter **Settings → Pages**. Die Veröffentlichung kann einige Minuten dauern.
6. Öffne diese Adresse auf dem iPhone in **Safari**. Tippe auf **Teilen** und dann **Zum Home-Bildschirm** (gegebenenfalls unter weiteren Aktionen). Aktiviere, falls angeboten, **Als Web-App öffnen**, und tippe auf **Hinzufügen**.
7. Starte WasserTracker über das neue Home-Bildschirm-Symbol. Beim ersten Aufruf ist Internet erforderlich, danach können bereits zwischengespeicherte App-Dateien offline funktionieren.

**Wichtig:** Diese Version sendet keine automatischen stündlichen Erinnerungen. Die Ja/Nein-Eingaben erfolgen manuell. Daten werden nur lokal auf dem jeweiligen Gerät gespeichert und nicht zwischen Windows und iPhone synchronisiert. Entfernen der App oder Löschen der Websitedaten kann die Einträge löschen.


## Version 1.4: Geräteanmeldung

Im Tab **Einstellungen** können sich Henning und Franka mit dem Einladungscode auf ihren jeweiligen iPhones registrieren. Die API ist `https://wassertracker-push.henning-zimmer.workers.dev`. Der Code wird nicht im Frontend gespeichert; das erhaltene Geräte-Zugriffstoken liegt im lokalen Browser-Speicher. Die bestehenden Trinkdaten bleiben unter `wassertracker-v1` erhalten und werden nicht zum Server übertragen. Einstellungen werden nach erfolgreicher Anmeldung über `/settings` gespeichert.

**Noch nicht enthalten:** Web-Push-Abonnement, Zeitplan und Versand von Benachrichtigungen. Die Einstellung `notifications_enabled` wird in dieser Version nicht aktiviert.

**Wichtig:** Ein Gerätename kann serverseitig nur einmal registriert werden. Bei Neuinstallation oder Verlust des lokalen Speichers ist eine kontrollierte Wiederherstellung bzw. Zurücksetzung nötig. Der aktuelle Worker benötigt zusätzlich Schutz gegen wiederholte Einladungscode-Versuche.
