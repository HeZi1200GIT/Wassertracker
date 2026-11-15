# WasserTracker 1.6.3 – Diagnose einklappen

Testnachricht und Serverstatus sind weiterhin unter Einstellungen → Push-Erinnerungen → Diagnose erreichbar. Dieser Bereich ist beim Appstart geschlossen. Beim Aufklappen wird der Status geladen. Benachrichtigungen aktivieren/deaktivieren bleibt außerhalb des Diagnosebereichs erreichbar.

## Update

1. Update-ZIP entpacken.
2. Auf GitHub im bisherigen Veröffentlichungsordner genau diese vier Dateien ersetzen: index.html, app.js, style.css und sw.js. Keine neuen Unterordner anlegen.
3. Commit changes bestätigen und die erfolgreiche Veröffentlichung abwarten.
4. Die bestehende Home-Bildschirm-App vollständig schließen und online erneut öffnen. Bei Bedarf wiederholen. Die App und ihre Websitedaten nicht löschen.
5. Unten muss Programmcode 1.6.3 bereit stehen. Unter Einstellungen erscheint Diagnose als zugeklappte Zeile. Beim Antippen werden Serverstatus und Testschaltfläche sichtbar.

## Unverändert

Kein Cloudflare-Update erforderlich: Worker bleibt 1.6.2. PUSH_ENABLED, Cron, Schlüssel, Geräteanmeldung und Abonnements bleiben unverändert. Die bisherigen lokalen Speicherschlüssel und Datenstrukturen bleiben erhalten. Icons, Tages-/Wochenansicht und persönliche Einstellungen bleiben erhalten.

## Prüfungen

JavaScript-Syntax und alle 24 vorhandenen Tests bestanden. Die semantische HTML-Struktur inklusive details/summary und eindeutigen Element-IDs wurde von den bestehenden Prüfungen erfasst. Das Details-Element hat kein open-Attribut und ist daher standardmäßig geschlossen. Eine visuelle Prüfung auf dem echten iPhone steht für diese Oberflächenänderung noch aus.

Die aktuell veröffentlichten App-Dateien wurden als Grundlage aus dem öffentlichen Repository hezi1200git/Wassertracker übernommen, weil sie im lokalen Projektordner nicht mehr vorhanden waren. Am öffentlichen Repository wurde nichts direkt geändert.
