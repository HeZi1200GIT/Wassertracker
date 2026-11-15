# WasserTracker 1.6 – stündliche Erinnerungen einschalten

Die Dateien sind vorbereitet und lokal geprüft. **In deinem Cloudflare-Konto ist dadurch noch nichts aktiviert.** Die bestehende App-Installation, Anmeldung und VAPID-Schlüssel weiterverwenden. Den gelöschten Recovery-Code nicht wieder anlegen.

## 1. Worker-Code veröffentlichen

1. ZIP entpacken. Cloudflare → Workers & Pages → wassertracker-push → Edit code öffnen.
2. Bisherigen Worker-Code auf dem PC sichern.
3. Die Datei **cloudflare/worker.mjs** aus diesem Paket in Windows Editor öffnen, alles kopieren und den vollständigen Code im Cloudflare-Editor ersetzen.
4. Deploy/Bereitstellen klicken. Bestehende DB-Bindung und Secrets behalten. **Keine Datenbank löschen oder Geräte erneut registrieren.** Der neue Worker legt nur zusätzliche Versandprotokoll-Tabellen automatisch an.

## 2. Konfiguration in Cloudflare ergänzen

Worker → Settings → Variables and Secrets:

- **VAPID_PUBLIC_KEY**: vorhandenen Wert unverändert lassen.
- **VAPID_PRIVATE_KEY**: vorhandenes Secret unverändert lassen. Die vorhandene einzelne base64url-Zeichenfolge wird unterstützt. Keine Schlüssel hier im Chat oder auf GitHub veröffentlichen.
- **VAPID_SUBJECT**: neue Variable anlegen, Inhalt `mailto:` direkt gefolgt von deiner echten E-Mail-Adresse, ohne Leerzeichen. Zum Beispiel ist die Form `mailto:name@deine-domain.de`; nicht diese Beispieladresse übernehmen. Apple benötigt eine gültige Kontaktangabe. Alternativ wird eine HTTPS-Kontaktadresse unterstützt.
- **PUSH_ENABLED**: neue Textvariable zunächst mit dem Wert **false** anlegen. Keine Anführungszeichen eingeben. Der Testversand funktioniert trotzdem; der automatische Versand bleibt bis zum erfolgreichen Test aus.

Änderungen jeweils bereitstellen. `DEVICE_INVITE_CODE`, `DB` und alle anderen bestehenden Werte beibehalten. Das entfernte Secret `HENNING_RECOVERY_CODE` bleibt entfernt.

## 3. App auf GitHub aktualisieren

1. Die neun App-/Bilddateien am bisherigen Veröffentlichungsort hochladen und ersetzen: index.html, app.js, style.css, sw.js, manifest.webmanifest, icon.svg, icon-192.png, icon-512.png und apple-touch-icon-1.5.4.png.
2. **cloudflare/worker.mjs gehört ausschließlich in den Cloudflare-Codeeditor und ersetzt niemals sw.js.** Keinen neuen Unterordner als App-Adresse anlegen.
3. Commit changes bestätigen, Veröffentlichung abwarten.
4. Die vorhandene Home-Bildschirm-App online vollständig schließen und erneut öffnen; bei Bedarf zweimal. Unten muss **Programmcode 1.6 bereit.** stehen.
5. Anmeldung als Henning prüfen. Zeitraum, Mindestmenge und Tagesziel prüfen, als Zeitzone **Europe/Berlin** speichern. Danach bei Bedarf Benachrichtigungen aktivieren. Eine bereits erfolgreiche Registrierung muss nicht grundsätzlich erneuert werden.

## 4. Eine echte Testnachricht senden

1. Zahnrad → **Serverstatus prüfen**. Die Meldung muss eine gültige Versandkonfiguration und mindestens ein gespeichertes Abonnement bestätigen. Der automatische Versand darf hier noch ausgeschaltet sein.
2. **Testnachricht senden** antippen. Es wird nur an das angemeldete Gerät gesendet, nicht an Franka. Höchstens ein Test je Kalenderminute und Abonnement.
3. Prüfen, ob die Meldung **WasserTracker · Test** tatsächlich am iPhone erscheint. Ein HTTP-Erfolg bestätigt nur die Annahme durch den Push-Dienst, nicht die Anzeige. Bei geöffneter App auch in der Mitteilungszentrale nachsehen und iOS-Mitteilungseinstellungen/Fokus prüfen.
4. Die Nachricht antippen: Die bestehende App soll geöffnet beziehungsweise in den Vordergrund gebracht werden. Nicht neu installieren.
5. Wenn keine Nachricht erscheint oder eine Fehlermeldung angezeigt wird: **PUSH_ENABLED vorerst false lassen** und den genauen Meldungstext mitteilen. Keine Schlüssel, Codes, Token oder Abonnement-Endpunkte teilen.

## 5. Den stündlichen Versand einschalten

Erst nach dem tatsächlichen Empfang der Testnachricht:

1. Cloudflare → Worker → Settings → Variables and Secrets → **PUSH_ENABLED** auf **true** setzen und bereitstellen.
2. Settings → Triggers beziehungsweise Trigger Events → **Cron Triggers** → Hinzufügen. Als Cron-Ausdruck exakt eingeben:

   `*/5 * * * *`

3. Speichern. Nur einen solchen Zeitplan anlegen; keine weiteren Erinnerungs-Crons hinzufügen.
4. Cloudflare prüft damit alle fünf Minuten. Eine Nachricht wird trotzdem **höchstens einmal pro abgeschlossener Stunde und Abonnement** innerhalb deines Zeitfensters angefordert. Die fünf Minuten dienen auch der Erkennung eines ausgefallenen ersten Aufrufs.
5. Es kann bis zu 15 Minuten dauern, bis der neue Cron aktiv ist. Danach in der App **Serverstatus prüfen**. Ein aktueller Zeitplanlauf mit Status `ok` bestätigt den Worker-Aufruf; den Empfang der nächsten stündlichen Nachricht separat prüfen.

Cloudflare dokumentiert Cron-Einrichtung und mögliche Verzögerung hier: https://developers.cloudflare.com/workers/configuration/cron-triggers/.

## 6. Test mit geschlossener App und gesperrtem iPhone

Bei 08–20 Uhr und Europe/Berlin werden Erinnerungen von **09:00 bis einschließlich 20:00 Uhr** angefordert, jeweils für die gerade abgeschlossene Stunde. Sommer-/Winterzeit wird berücksichtigt. Beispiel: 10:00 fragt nach 09–10 Uhr.

1. Vor der nächsten vollen Stunde die App vollständig schließen und das iPhone sperren.
2. Innerhalb der ersten Minuten nach der vollen Stunde auf die Erinnerung achten. Cron und Push-Dienst garantieren keine sekundengenaue Zustellung. Ist die erste Prüfung ausgefallen, kann die Erinnerung bis Minute 10 angefordert werden; bis Minute 14 wird ein Aufruf noch berücksichtigt.
3. Nachricht antippen und Appöffnung prüfen. Bereits erfasste Antworten bleiben erhalten. Der Server kennt deine lokalen Antworten nicht; die Erinnerung kommt daher unabhängig davon, ob du bereits Ja/Nein erfasst hast.
4. Benachrichtigungen in der App deaktivieren: Der Worker schaltet das Gerät aus und entfernt dessen gespeicherte Push-Abonnements. Danach darf kein neuer planmäßiger Versand für dieses Gerät stattfinden. Bereits an Apple übergebene Nachrichten lassen sich nicht zurückrufen.

## Fehlerdiagnose

- **VAPID_SUBJECT fehlt**: Schritt 2 nachholen.
- **Schlüssel ungültig oder passen nicht zusammen**: Werte im Cloudflare-Konto prüfen. Nicht einfach ein neues Schlüsselpaar erzeugen; bestehende Abonnements hängen am bisherigen öffentlichen Schlüssel.
- **Kein Abonnement / abgelaufen**: Benachrichtigungen auf dem bestehenden Home-Bildschirm-Gerät erneut aktivieren.
- **HTTP 401/403 bei Apple**: VAPID-Schlüsselpaar, Kontaktangabe und Uhrzeit prüfen. Die App zeigt den HTTP-Status des letzten Versuchs über Serverstatus an.
- **HTTP 404/410**: Abonnement wird automatisch aus der Datenbank entfernt. Auf dem betroffenen Gerät erneut aktivieren.
- **Kein Zeitplanlauf / alter Zeitplanlauf**: Cron-Einrichtung, Bereitstellung und bis zu 15 Minuten Aktivierungszeit prüfen.
- **configuration_error**: Die Schlüssel-/Kontaktkonfiguration ist noch nicht gültig; Serverstatus zeigt die Erklärung.
- **failed / unknown**: HTTP-Fehler beziehungsweise unklarer Versand, etwa Netzwerkunterbrechung. Nicht als erfolgreiche Anzeige werten. Es gibt für diese Stunde bewusst keine automatische Wiederholung eines bereits begonnenen Versandversuchs, um doppelte Nachrichten zu vermeiden. Der nächste Stundenversand wird unabhängig neu versucht.
- **reserved**: Ein Versuch wurde reserviert, aber noch nicht abgeschlossen; bei dauerhaftem Zustand wurde der Worker vermutlich unterbrochen. Diese Stunde wird nicht erneut verschickt.
- Zum sofortigen Stoppen: **PUSH_ENABLED=false** bereitstellen. Das stoppt weitere Cron-Versendungen, löscht keine Anmeldung und keine Trinkdaten. Ein manueller Test ist weiterhin möglich.

## Datenschutz und technische Grenzen

Die Erinnerung enthält nur den Trink-Check und die eingestellte Mindestmenge, keine Trinkhistorie. Die bestehenden lokalen Datenschlüssel bleiben gleich. Franka erhält erst Nachrichten, wenn sie ihr eigenes Gerät registriert und Benachrichtigungen aktiviert. Ihre individuellen Einstellungen gelten separat. Ungültige Zeitzonen führen zu keinem Versand; fehlende Zeitzonen verwenden Europe/Berlin. Die bisherige Spalte interval_minutes wird nicht verwendet: diese Version erinnert stündlich.

Neu sind die Tabellen push_delivery_log (Geräte-ID, Hash des Endpunkts, Stundenkennung, Zeitpunkt, Status/HTTP-Code; Aufbewahrung sieben Tage) und push_scheduler_state (letzter Cron-Aufruf). Es werden keine Trinkdaten hochgeladen. Bereits vorhandene Tabellen werden nicht ersetzt.

Doppelsendeschutz ist serverseitig und atomar. Es gibt keine Browser-Erinnerungstimer. Bei Netzwerkfehlern ist eine exakt einmalige Zustellung nicht beweisbar; diese Version bevorzugt einen möglicherweise ausgefallenen Stundenhinweis gegenüber Doppelversand. Längere Ausfälle werden nicht nachträglich mit alten Nachrichten aufgeholt. Nach Annahme durch Apple bleibt die tatsächliche Zustellung eine eigene Prüfung; TTL ist 15 Minuten.

## Prüfstand

22 lokale Tests bestanden: Verschlüsselung unabhängig entschlüsselt, ES256-Signatur unabhängig geprüft, Zeitfenster/Sommerzeit, Mehrfachausführung, ungültige Abonnements, Fehlerfälle, authentifizierte API-Endpunkte und alle bisherigen Erhaltungs-/Wiederherstellungstests. Schema-Prüfungen verwenden SQLite mit den aus deinem Worker bekannten Feldern. Produktive Cloudflare-D1-Bindings, echte Apple-Zustellung und die neue iPhone-Oberfläche sind noch nicht live geprüft.

Referenzen: RFC 8291 https://www.rfc-editor.org/rfc/rfc8291.html und RFC 8292 https://www.rfc-editor.org/rfc/rfc8292.html.
