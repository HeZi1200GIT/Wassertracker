# Hennings Anmeldung wiederherstellen – Version 1.5.2

Die alte App-Installation besitzt das Zugriffstoken nicht mehr. Der Worker speichert nur dessen Hash, deshalb kann er das alte Token nicht zurückgeben. Der vorbereitete neue Endpunkt `/recover` stellt ausschließlich Hennings Zugang wieder her. Noch wurde nichts in Cloudflare veröffentlicht oder an produktiven Daten geändert.

## 1. Worker aktualisieren (PC)

1. Öffne Cloudflare → Workers & Pages → wassertracker-push → Edit code.
2. Sichere den bisherigen Code auf dem PC als Textdatei.
3. Öffne aus diesem Paket `cloudflare/worker.mjs` in einem Texteditor, etwa Windows Editor. Kopiere den vollständigen Inhalt.
4. Ersetze im Cloudflare-Codeeditor den bisherigen Code durch diesen Inhalt und klicke Deploy/Bereitstellen.
5. Die bestehenden Bindings und Geheimnisse `DB`, `DEVICE_INVITE_CODE`, `VAPID_PUBLIC_KEY` beibehalten. Keine Datenbank löschen oder neu anlegen. Es ist kein SQL-Befehl von Hand erforderlich.

## 2. Separaten Wiederherstellungscode freischalten (PC)

1. Erzeuge in einem Passwortmanager ein neues zufälliges Passwort mit mindestens 32 Zeichen (empfohlen: 48 Zeichen aus Buchstaben und Ziffern). Kein Beispielpasswort und nicht den Einladungscode verwenden. Maximal 256 Zeichen.
2. Bewahre es vorübergehend im Passwortmanager auf, sodass du es auf dem iPhone einfügen kannst. Nicht hier im Chat oder auf GitHub veröffentlichen.
3. Öffne beim Worker Settings/Einstellungen → Variables and Secrets/Variablen und Geheimnisse → Add/Hinzufügen.
4. Typ **Secret** wählen, Name exakt `HENNING_RECOVERY_CODE`, Wert das neue zufällige Passwort.
5. Mit Deploy/Bereitstellen speichern. Andere Secrets nicht ändern.

Cloudflare beschreibt die Secret-Verwaltung unter https://developers.cloudflare.com/workers/configuration/secrets/.

## 3. App aktualisieren (PC)

1. Aus dem Paket nur die App-Dateien in den bisherigen GitHub-Pages-Veröffentlichungsordner hochladen: `index.html`, `app.js`, `style.css`, `sw.js`, `manifest.webmanifest`, `icon.svg`, `icon-192.png`, `icon-512.png`.
2. Dateien direkt am bisherigen Ort ersetzen, keinen zusätzlichen Unterordner anlegen. `cloudflare/worker.mjs` gehört in Cloudflare, nicht anstelle von `sw.js`! Das sind zwei unterschiedliche Programme.
3. Commit changes bestätigen und die Veröffentlichung abwarten.

## 4. Zugang auf dem iPhone wiederherstellen

1. Das jetzt vorhandene Home-Bildschirm-Symbol weiterverwenden. Nicht erneut hinzufügen und keine Websitedaten löschen.
2. App online schließen und erneut öffnen. Unten muss Version **1.5.2** stehen. Andernfalls wurde die neue Version noch nicht geladen; dann noch nicht fortfahren.
3. Zahnrad öffnen. Unter Mein iPhone erscheint zusätzlich **Hennings Anmeldung wiederherstellen**.
4. Den neuen Wiederherstellungscode einfügen und **Hennings Zugang wiederherstellen** antippen. Nicht das normale Anmeldeformular mit dem Einladungscode verwenden.
5. Erfolgsanzeige prüfen: **Angemeldet als Henning**. Seine persönlichen Servereinstellungen werden nachgeladen.
6. Den Secret-Eintrag `HENNING_RECOVERY_CODE` in Cloudflare wieder entfernen und die Änderung bereitstellen. Nur dieses Secret entfernen.
7. Auf dem iPhone **Benachrichtigungen aktivieren** antippen und die iOS-Erlaubnis erteilen. Danach sollte die Registrierung bestätigt werden. Tatsächlicher automatischer Versand ist weiterhin nicht implementiert.

## Wirkung und Fehlerfälle

- Gerätekennung, Zeitraum, Mindestmenge, Tagesziel und weitere persönliche Servereinstellungen bleiben erhalten.
- Hennings altes Zugriffstoken wird ungültig. Seine alten Push-Abonnements werden entfernt und Benachrichtigungen zunächst ausgeschaltet. Anschließend Push auf dem neuen Gerät aktivieren.
- Frankas Gerätezugang, Einstellungen und Push-Abonnements werden nicht geändert.
- Lokale Trinkdaten werden weder gelöscht noch wiederhergestellt. Der Worker besitzt diese Daten nicht.
- Der Worker legt bei erfolgreicher Codeprüfung die zusätzliche Tabelle `used_recovery_codes` an. Sie speichert nur Hashes verbrauchter Wiederherstellungscodes. Ein Code kann auch bei parallelen Anfragen nur einmal verwendet werden. Bestehende Tabellen werden nicht ersetzt.
- Ohne Secret ist `/recover` deaktiviert. Der Einladungscode reicht für die Wiederherstellung nicht aus.
- Wird nach erfolgreicher Tokenänderung die Netzwerkantwort oder die lokale Speicherung unterbrochen, kann der Code bereits verbraucht sein. Dann in Cloudflare einen neuen zufälligen Code hinterlegen und erneut versuchen. Nicht Gerätezeilen löschen.
- Bei „Nicht gefunden“/404 zuerst die Worker-Veröffentlichung prüfen. Bei „nicht freigeschaltet“ den Secret-Namen und die Veröffentlichung prüfen. Bei anderen Fehlern den Meldungstext notieren, ohne Codes oder Token zu teilen.

## Lokal geprüft

13 Tests bestanden: App-Bestandstests plus Wiederherstellung mit SQLite-Testdaten, Erhalt von ID und Einstellungen, Ausschluss von Franka, Ablehnung falscher oder verbrauchter Codes und lokale Speicherung des neuen Tokens ohne Änderung der Trinkdaten.

Prüfbefehl mit Node.js 24: `node --test tests/regression.cjs tests/recovery.cjs`.

Cloudflare-D1 im produktiven Konto, Wiederherstellung auf dem echten iPhone und tatsächliche Push-Zustellung wurden nicht ausgeführt. Die lokale SQLite-Prüfung verwendet die aus dem Worker ableitbaren Tabellenfelder; unbekannte zusätzliche Produktions-Constraints können noch Fehler verursachen. Änderungen deshalb anhand der Meldungen prüfen.
