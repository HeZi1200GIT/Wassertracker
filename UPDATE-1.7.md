# WasserTracker 1.7 – Nachtragen, Monatsübersicht und Wochenplan

## 1. Zuerst den Worker aktualisieren

1. Das Update-ZIP entpacken.
2. Cloudflare → Workers & Pages → wassertracker-push → Edit code öffnen. Den bisherigen Code auf dem PC sichern.
3. **cloudflare/worker.mjs** aus diesem Paket in Windows Editor öffnen. Den vollständigen Inhalt kopieren und den bisherigen Worker-Code in Cloudflare vollständig ersetzen.
4. Deploy/Bereitstellen klicken. Die öffentliche Worker-Startadresse muss anschließend **version 1.7** anzeigen.
5. Alle vorhandenen Schlüssel, Secrets und die DB-Bindung behalten. **PUSH_ENABLED=true** und den funktionierenden Cron ***/5 * * * *** unverändert lassen. Den Recovery-Code nicht erneut anlegen.

Der Worker ergänzt automatisch nur die Tabelle `device_weekly_schedule`, mit genau einem optionalen Wochenplan pro Geräte-ID. Bestehende Tabellen und Trinkdaten werden nicht migriert oder ersetzt. Ohne Wochenplan gilt weiterhin an allen Tagen der bisherige allgemeine Zeitraum.

## 2. Dann die App auf GitHub aktualisieren

1. Im bisherigen GitHub-Pages-Veröffentlichungsordner diese vier Dateien ersetzen: **index.html, app.js, style.css, sw.js**. Nicht als neuen Unterordner hochladen.
2. Commit changes bestätigen und die erfolgreiche Veröffentlichung abwarten.
3. Die vorhandene Home-Bildschirm-App online vollständig schließen und erneut öffnen, bei Bedarf zweimal.
4. Unten muss **Programmcode 1.7 bereit.** stehen. Unter Mein iPhone muss die bestehende Anmeldung erhalten sein.

Der Cloudflare-Worker ist nicht die Datei sw.js! Die Worker-Datei nur in Cloudflare veröffentlichen. Das Home-Bildschirm-Symbol weiterverwenden, weder App noch Websitedaten löschen. Keine neue Registrierung erforderlich.

## 3. Vergangene Tage nachtragen

- In der Tagesansicht oben das Datum antippen oder mit ‹ einen Tag zurückgehen.
- Für den gewählten Tag Ja/Nein erfassen. Jede Änderung wird direkt auf diesem Gerät gespeichert. Erneutes Tippen auf dieselbe Antwort setzt sie auf Offen.
- Mit **Zurück zu heute** zur aktuellen Tagesansicht zurückkehren.
- Zukünftige Tage können nicht bearbeitet werden. Datum und Speicherbestätigung zeigen, welcher Tag geändert wurde.

Alle bisherigen Einträge bleiben unter `wassertracker-v1` mit denselben Stundenindizes erhalten. Wochenstatistik, Tagesziel und Medaillen aktualisieren sich nach Korrekturen. Keine Trinkantwort wird an Cloudflare übertragen.

## 4. Monatsübersicht

- Oben **Monat** wählen, mit ‹ und › Monate wechseln oder **Aktueller Monat** antippen.
- Ein Tag zeigt die Ja-Anzahl; ★ markiert ein erreichtes Tagesziel.
- Ein Tipp auf einen vergangenen Tag öffnet dessen Tagesansicht zum Nachtragen.
- Die Bilanz zählt Ja, Nein und offene Stunden. Zukünftige Tage werden nicht als offene Stunden gezählt. Vergangene Tage ohne Einträge gelten als offen, auch wenn die App damals noch nicht genutzt wurde.

Wie bisher die Wochenstatistik verwendet die Monatsübersicht den **aktuellen allgemeinen Trinkzeitraum, die aktuelle Mindestmenge und das aktuelle Tagesziel**. Historische Einstellungen waren bislang nicht je Tag gespeichert. Daher lassen sich frühere Bedingungen nicht rekonstruieren; Änderungen der allgemeinen Werte können die angezeigte Auswertung vergangener Tage verändern. Die Antworten selbst werden dadurch nicht verändert.

## 5. Erinnerungen nach Wochentag

1. Zahnrad → Persönliche Einstellungen → **Erinnerungen nach Wochentag**.
2. **Eigene Zeiten je Wochentag** einschalten. Der Wochenplan wird zunächst mit deinen bisherigen allgemeinen Zeiten vorbelegt.
3. Für jeden Tag festlegen, ob Erinnerungen gewünscht sind, sowie Beginn und Ende auswählen. Zum Beispiel Montag–Freitag 08–20 Uhr, Samstag 10–20 Uhr, Sonntag ausschalten.
4. **Einstellungen speichern** antippen und die Bestätigung abwarten. App erneut öffnen und die gespeicherten Werte prüfen.
5. Wird **Eigene Zeiten je Wochentag** ausgeschaltet und gespeichert, gilt wieder der allgemeine Zeitraum täglich. Der individuelle Wochenplan wird für dieses Gerät entfernt.

Beginn und Ende müssen am selben Tag liegen: 08–20 Uhr bedeutet Erinnerungen nach abgeschlossenen Stunden von 09 bis einschließlich 20 Uhr. Zeiten über Mitternacht werden nicht unterstützt. Der Wochentag richtet sich nach der gespeicherten Gerätezeitzone, einschließlich Sommer-/Winterzeit. Eine globale Deaktivierung der Benachrichtigungen hat Vorrang vor dem Wochenplan. Eine manuelle Testnachricht unter Diagnose ist absichtlich unabhängig vom gewählten Wochentag/Zeitraum.

Der Wochenplan steuert ausschließlich Erinnerungen, nicht die Stunden in der Trinkübersicht oder deren Auswertung. Henning und Franka haben getrennte Pläne über ihre jeweiligen Gerätetoken. Ohne eigenen Plan bleibt Frankas bisheriger Zeitraum erhalten.

## 6. Kurzer iPhone-Test

1. Vorher einen bestehenden Tag, die Bilanz und die Anmeldung notieren. Nach Update vergleichen.
2. Einen vergangenen Tag auswählen, eine Testantwort ändern, Speicherung prüfen, die Antwort anschließend auf den ursprünglichen Zustand zurücksetzen.
3. Monatsübersicht und Navigation über einen Jahreswechsel prüfen. Einen Kalendertag antippen, Datum der geöffneten Tagesansicht vergleichen. Zukünftige Tage müssen gesperrt sein.
4. Wochenplan nach Wunsch speichern, App schließen/öffnen, Werte vergleichen. Benachrichtigungen müssen weiterhin aktiviert sein.
5. Unter Diagnose Serverstatus und gegebenenfalls eine Testnachricht prüfen. Vor der nächsten passenden Erinnerungsstunde die App schließen und das iPhone sperren; den tatsächlichen Empfang prüfen.
6. An einem ausgeschalteten Wochentag darf kein neuer automatischer Versand angefordert werden. Bereits an Apple übergebene Nachrichten können noch erscheinen. Der Server kennt deine lokalen Trinkantworten nicht; Einträge verhindern daher keine Erinnerung.
7. Offline die Tages-/Monatsansicht und das Speichern einer Testantwort prüfen, danach Testantwort zurücksetzen und wieder online gehen. Servereinstellungen benötigen weiterhin Internet.

Wenn eine Meldung zum alten Worker erscheint: Schritt 1 prüfen und App erneut öffnen. Die App bestätigt einen Wochenplan nicht stillschweigend als gespeichert, wenn der Worker dessen Unterstützung nicht meldet.

## Technische Prüfung und Grenzen

35 lokale Tests bestanden. Abgedeckt sind die bisherigen Geräte-/Push-Funktionen sowie Nachträge und Datenbestand, Zukunftssperre, Speicherfehler, Schaltjahr und Monatswechsel, Monatsbilanz, Aufruf eines Kalendertags, Wochenplan-Übertragung mit Bearer-Token, getrennte Geräte, Eingabevalidierung, ältere Clients, deaktivierte Wochentage und lokale Gerätezeitzone.

Syntax geprüft für app.js, sw.js und cloudflare/worker.mjs. Der automatisierte visuelle Browser-Test wurde durch eine Beschränkung des verfügbaren Windows-Browsers gestoppt. Die neue Darstellung, iPhone-Datumsauswahl und echte Push-Zustellung mit Wochenplan müssen deshalb noch auf dem iPhone geprüft werden. Der zuvor bestätigte Versandmechanismus (Verschlüsselung, VAPID, Redirect-Modus manual) bleibt erhalten.

Neue API-Einstellung: `weeklySchedule`, entweder null oder sieben Objekte in Reihenfolge Montag bis Sonntag, jeweils `{enabled: true/false, startHour: 8, endHour: 20}`. GET /settings liefert den Wochenplan und `capabilities.weeklySchedule=true`. POST speichert allgemeine Einstellungen und Wochenplan atomar. Fehlt das Feld bei einem älteren Client, bleibt ein vorhandener Wochenplan erhalten. Beschädigte gespeicherte Wochenpläne führen sicherheitshalber zu keinem automatischen Versand.

Lokale Prüfungen mit Node.js 24: `node --test tests/regression.cjs tests/recovery.cjs tests/push.cjs`.
