# WasserTracker 1.5 auf dem iPhone testen

1. **Vor dem Update:** In der vorhandenen App einige Antworten, die Wochenbilanz, die Anmeldung und persönliche Einstellungen notieren oder Bildschirmfotos machen. Die App nicht löschen.
2. Die Programmdateien nach der README auf **derselben** GitHub-Pages-Adresse aktualisieren. Die bestehende App online erneut öffnen. Unten steht „Version 1.5“.
3. Prüfen: Henning ist weiterhin angemeldet, die notierten Antworten und Wochenwerte sind noch vorhanden. Auch Mindestmenge, Tagesziel und Zeitraum müssen stimmen. Falls etwas fehlt: nicht neu anmelden oder Daten löschen, sondern zuerst prüfen, ob dieselbe Adresse und Installation geöffnet wurde.
4. Heute und Wochenstatistik ansehen. Auf dem kleinsten verfügbaren iPhone beziehungsweise im Hochformat dürfen Zahnrad, Datum, Zeitfenster, Balken und Medaillen nicht überlappen.
5. Zahnrad antippen: Einstellungen erscheinen. Erneut antippen oder „Zur Tagesübersicht“ wählen: Heute erscheint wieder.
6. Einen persönlichen Einstellungswert ändern und speichern, App erneut öffnen und Wert prüfen. Danach bei Bedarf den ursprünglichen Wert wiederherstellen. Änderungen am Zeitraum/Tagesziel beeinflussen die Auswertung; die gespeicherten Antworten bleiben bestehen.
7. Für Push: iOS 16.4 oder neuer verwenden. Die App muss über HTTPS und ihr Home-Bildschirm-Symbol gestartet sein. Eine bereits installierte App nicht neu installieren.
8. Zahnrad → „Benachrichtigungen aktivieren“ antippen. Erst jetzt darf iOS die Freigabe abfragen. Erlauben. Danach muss „Push-Abonnement erfolgreich registriert“ erscheinen. Ein späterer erneuter Tipp verwendet das bestehende Abonnement.
9. Bei Ablehnung: Hinweise beachten und unter iPhone-Einstellungen → Mitteilungen → WasserTracker erlauben, sofern die App dort angeboten wird. Die App wieder öffnen und erneut aktivieren. Bei fehlender Home-Bildschirm-Installation den angezeigten Hinweis befolgen. Bestehende Installation und Daten erhalten.
10. „Benachrichtigungen deaktivieren“ prüfen: Die App bestätigt die deaktivierten Geräteeinstellungen. Das serverseitige Abonnement wird derzeit nicht gelöscht. Bei Bedarf anschließend wieder aktivieren.
11. Offline prüfen: App einmal online laden, Flugmodus einschalten und die App erneut öffnen. Tagesübersicht und vorhandene Statistik sollen nutzbar sein. Eine Testantwort ändern, App erneut öffnen und Speicherung prüfen; anschließend Testantwort zurücksetzen. Einstellungen und Push-Registrierung benötigen Internet. Flugmodus wieder ausschalten.
12. Frankas Anmeldung erst auf ihrem eigenen iPhone durchführen. Henning dafür nicht neu registrieren. Ihre persönlichen Werte und Einträge müssen von Hennings Gerät unabhängig sein.

## Was noch kein bestandener Versandtest ist

Die Erfolgsmeldung bestätigt nur das gespeicherte Push-Abonnement und die aktivierte Einstellung. Der Worker versendet derzeit noch keine vollständigen automatischen Erinnerungen. Es ist daher jetzt keine stündliche Nachricht zu erwarten.

Nach Umsetzung der Serverfunktionen muss ein echter Test folgen: autorisierte Testnachricht senden, Anzeige bei geschlossener App und gesperrtem iPhone prüfen, Nachricht antippen und Appöffnung bestätigen. Danach Zeitfenster, Zeitzone, ausgeschaltete Erinnerungen und ungültige Abonnements testen. Ohne diesen Test ist die Zustellung nicht bestätigt.

## Bei Fehlern

Den genauen Meldungstext und den Schritt notieren. Keine Einladungscodes, Token oder vollständigen Abonnementdaten weitergeben. Bei Netzwerkfehlern Internet und dieselbe GitHub-Pages-Adresse prüfen. Der Worker erlaubt derzeit als Browser-Ursprung `https://hezi1200git.github.io`; andere Ursprünge benötigen eine Worker-Anpassung.
