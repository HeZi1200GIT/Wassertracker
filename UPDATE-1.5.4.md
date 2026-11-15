# WasserTracker 1.5.4 – gemeinsames Tropfensymbol

Der Wassertropfen bleibt auf Wunsch im Kopfbereich. Statt des Emoji verwendet er nun dasselbe Motiv wie das App-Symbol: weißer Tropfen mit hellblauem Glanz auf blauem Hintergrund.

## Auf GitHub Pages aktualisieren

1. Das Update-ZIP entpacken.
2. Alle neun Programm-/Bilddateien direkt im bisherigen Veröffentlichungsordner ersetzen beziehungsweise hinzufügen: index.html, app.js, style.css, sw.js, manifest.webmanifest, icon.svg, icon-192.png, icon-512.png, apple-touch-icon-1.5.4.png.
3. Mit Commit changes speichern und die erfolgreiche Veröffentlichung abwarten. Keine neuen Unterordner verwenden.
4. Die bestehende Home-Bildschirm-App online vollständig schließen und erneut öffnen. Bei Bedarf einmal wiederholen.
5. Unten müssen Version 1.5.4 und Programmcode 1.5.4 bereit stehen. Im Kopfbereich muss der neue Tropfen erscheinen; die Geräteanmeldung muss weiterhin bestehen.

Am Cloudflare-Worker und seinen Secrets ist nichts zu ändern. Den Wiederherstellungscode nicht neu einrichten. Lokale Trinkdaten und Einstellungen behalten ihre Speicherschlüssel; Startadresse und Manifest-Scope bleiben unverändert.

## Home-Bildschirm-Symbol

Die neue Icon-Datei ist als apple-touch-icon (180×180 PNG) eingebunden. Manifest-Icons (192 und 512 Pixel), Favicon, Benachrichtigungssymbol und Kopfbereich verwenden dasselbe Tropfenmotiv. Die Bildadressen und der Service-Worker-Cache sind versioniert.

Das tatsächliche Aktualisieren eines bereits installierten Symbols durch iOS ist noch nicht auf dem iPhone geprüft. Wenn dort zunächst das alte Symbol bleibt, die vorhandene Installation weiterverwenden. Nicht löschen oder neu hinzufügen: Das könnte erneut eine andere lokale Installation ohne Anmeldung erzeugen. Die App kann auch mit dem alten Home-Bildschirm-Symbol weiter funktionieren.

Apple beschreibt die Icon-Einbindung hier: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html

## Prüfung

JavaScript-Syntax geprüft, alle 15 vorhandenen Tests bestanden und die erzeugte PNG-Datei visuell geprüft. Ein tatsächlicher iPhone-Icon-/Layout-Test steht aus. Kein automatischer Push-Versand ergänzt.

Im vollständigen Paket liegt tools/generate-icons.ps1 zur reproduzierbaren Erzeugung der PNGs aus derselben Vektorform. Es ist für den Upload nicht nötig.
