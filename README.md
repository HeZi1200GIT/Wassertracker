# WasserTracker 1.5

Weiterentwicklung der vorhandenen PWA: Tagesübersicht, Ja/Nein-Antworten, Tagesziel, Wochenstatistik und Medaillen bleiben erhalten. Einstellungen öffnen über das Zahnrad oben rechts. Ein weiterer Tipp auf das Zahnrad oder „Zur Tagesübersicht“ schließt sie.

## Bestehende Daten behalten

Beim Update **dieselbe GitHub-Pages-Adresse, denselben Repository-Pfad und dieselbe iPhone-Installation verwenden**. Die App nicht entfernen und Safari-/Websitedaten nicht löschen. Keine neue Installation zum Ersetzen der alten anlegen. Daten anderer Geräte oder Browser werden nicht automatisch übernommen.

Diese Schlüssel und das Trinkdatenformat bleiben unverändert:
- `wassertracker-v1`: alle bisherigen Trinkdaten; keine Migration und kein Upload.
- `wassertracker-settings-v2`: persönliche Einstellungen dieser Installation.
- `wassertracker-device-v2`: Gerätekennung und Zugriffstoken dieser Installation.

Neu ist lediglich `wassertracker-push-v1` als lokaler Hinweis auf die zuletzt erfolgreiche Push-Registrierung. Er enthält kein Geräte-Zugriffstoken. Offline-Caches werden aktualisiert; Local Storage wird dabei nicht gelöscht. Ein Update schützt nicht vor dem Löschen von Browserdaten durch Benutzer oder Betriebssystem.

## Auf GitHub Pages aktualisieren

1. `WasserTracker-1.5.zip` auf dem PC entpacken.
2. Auf GitHub das **bisherige** WasserTracker-Repository öffnen.
3. **Add file → Upload files** wählen. Die Dateien aus dem entpackten Ordner hochladen: `index.html`, `app.js`, `style.css`, `sw.js`, `manifest.webmanifest`, `icon.svg`, `icon-192.png`, `icon-512.png`. Sie müssen dieselben Dateien im bisherigen Veröffentlichungsordner ersetzen. Nicht den ZIP-Ordner als neuen Unterordner hochladen.
4. Mit **Commit changes** speichern. Die vorhandene Pages-Konfiguration beibehalten und die erfolgreiche Veröffentlichung abwarten.
5. Auf dem iPhone die **bestehende** WasserTracker-App öffnen. Bei Internetverbindung schließen und erneut öffnen, falls noch die alte Ansicht erscheint. Keine Websitedaten löschen.
6. Unten muss „Version 1.5“ stehen. Danach die beigefügte `IPHONE-TEST.md` abarbeiten.

Keine Einladungscodes oder Zugriffstoken ins Repository schreiben. Die ZIP enthält nur Programmdateien, Tests und Anleitungen, keine persönlichen Browserdaten.

## Geräte und Einstellungen

Henning bleibt mit seinem vorhandenen Token angemeldet. Franka meldet später ihr eigenes iPhone mit ihrem Einladungscode an. Es gibt keine gemeinsame Anmeldung. Der Worker ordnet Einstellungen und Abonnements dem Bearer-Token zu. Die App speichert weiterhin Beginn, Ende, Mindestmenge, Tagesziel und Benachrichtigungsstatus. Die Übernahme unvollständiger Serverantworten löscht keine vorhandenen Einstellungswerte.

Das Token bleibt für die bestehende Anmeldung im Local Storage; dies ist kein verschlüsselter iOS-Schlüsselspeicher. Keine fremden Skripte einbinden. Es wird ausschließlich im Authorization-Header an den konfigurierten HTTPS-Worker gesendet, niemals in URLs. Einladungscodes werden nicht dauerhaft gespeichert.

## Push: umgesetzt und noch offen

Umgesetzt sind Voraussetzungenprüfung, Berechtigungsabfrage ausschließlich nach Tastendruck, Service-Worker-Registrierung, dynamischer VAPID-Schlüssel, Erstellen oder Wiederverwenden eines Abonnements und Übertragung an den Worker. Empfangene Nachrichten zeigt der Service Worker an; Antippen öffnet die App oder bringt ein vorhandenes Fenster nach vorn. Die Oberfläche unterscheidet Freigabe, Registrierung und Fehler.

„Benachrichtigungen deaktivieren“ speichert `notificationsEnabled:false` am Worker. Das Abonnement bleibt dort gespeichert. Ein späterer Versand muss diesen Schalter berücksichtigen. Die App erfindet keinen Lösch-Endpunkt. Eine Betriebssystem-Sperre ist zusätzlich unter iPhone-Einstellungen → Mitteilungen → WasserTracker möglich.

**Ein registriertes Abonnement bedeutet noch keinen automatischen Versand.** Im Worker fehlen laut Entwicklungsauftrag:

1. Web-Push-Verschlüsselung der Nutzlast.
2. VAPID-Signierung und tatsächlicher Versand an den Push-Dienst, einschließlich Apple.
3. Cloudflare-Cron-Ausführung oder ein anderer zuverlässiger serverseitiger Zeitplan.
4. Individuelle Zeitfenster und Zeitzonen einschließlich Sommer-/Winterzeit. Der aktuelle Einstellungsvertrag enthält noch kein Zeitzonenfeld.
5. Entfernen ungültiger Abonnements, etwa nach HTTP 404/410 des Push-Dienstes.
6. Ein authentifizierter Endpunkt zum sicheren Entfernen eines Abonnements.

Es gibt keine lokalen JavaScript-Erinnerungstimer. Es wurde keine Push-Zustellung auf ein gesperrtes oder geschlossenes iPhone getestet oder bestätigt.

## Worker-Vertrag und tatsächliche Prüfung

API: `https://wassertracker-push.henning-zimmer.workers.dev`

- `POST /register`: `{name,inviteCode}`; Antwort muss `deviceId`, `deviceName`, `token` enthalten. Bestehende Anmeldung wird nicht erneuert.
- `GET /settings`, `POST /settings`: Bearer-Token. POST überträgt camelCase-Felder wie im Auftrag. GET akzeptiert camelCase oder das bisherige snake_case, in `settings` oder direkt im Antwortobjekt. Nur gültige vorhandene Werte werden übernommen.
- `GET /push/public-key`: dynamisch `{publicKey}`.
- `POST /push/subscribe`: Bearer-Token; direkt `{endpoint,keys:{p256dh,auth}}` aus dem Browser-Abonnement, gegebenenfalls mit standardmäßigem `expirationTime`.

Am 15.11.2026 tatsächlich geprüft: öffentlicher Schlüssel liefert HTTP 200 und `{publicKey}`. GET `/settings` und POST `/push/subscribe` liefern ohne Token HTTP 401 mit `{"error":"Nicht autorisiert"}`. Es wurden keine produktiven Geräte angelegt oder verändert. Authentifizierte Serverantworten konnten ohne Zugriff auf das bestehende iPhone-Token nicht live geprüft werden; ihre Abläufe wurden mit simulierten Antworten getestet.

Beobachtete CORS-Freigabe: **`https://hezi1200git.github.io`**. Hosting auf einer anderen Domain oder localhost benötigt eine entsprechende Worker-Freigabe. Ein erfolgreicher Terminalabruf allein beweist keine CORS-Funktion im Browser.

## Prüfungen

Mit Node.js: `node --check app.js`, `node --check sw.js`, `node --test tests/regression.cjs`.

Acht automatisierte Prüfungen bestanden: unveränderte alte Einträge/Anmeldung, ungültige Serverzeitfenster, Push-Standardnachricht, Zahnrad öffnen/schließen, camelCase-Einstellungen, VAPID-Umwandlung und authentifizierter Abonnement-/Deaktivierungsablauf, verweigerte Berechtigung und HTML-ID-/Tag-Struktur.

Die CSS-Regeln berücksichtigen 320-Pixel-Breite, umbrechende Überschriften und getrennte Statistikspalten. Die tatsächliche visuelle Browserprüfung wurde durch einen Timeout zum lokalen Testserver blockiert; eine Safari-/iPhone-Prüfung ist noch erforderlich. Ein vollständiger Offline-/Update-Test auf dem iPhone steht ebenfalls aus. Siehe `IPHONE-TEST.md`.

iPhone-Voraussetzungen: HTTPS, iOS 16.4 oder neuer, Start über den Home-Bildschirm. Quelle: [Apple/WebKit](https://webkit.org/blog/13878/).
