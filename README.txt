JWNH LUCKY DRAW 2026 - FESTIVE PWA

Files:
- index.html: application interface
- app.js: draw logic, participant management, confirmation, history and audit
- manifest.webmanifest: installable app settings
- sw.js: offline caching (cache version v6)
- icon.svg: application icon

FEATURES
- Festive red and gold theme
- Dramatic synthesized sound effects and optional original background music
- Rapid rolling-name animation with a large winner reveal and confetti
- Winner confirmation prompt: Try Again / Next Prize
- Draw sequence runs 5th → 4th → 3rd → 2nd → 1st Prize
- Restart Draw clears confirmed winners and returns to 5th Prize while retaining participants, settings and audit log
- 1st Prize remains organiser-selected (default recipient Sal); the method is recorded
- Prizes 2-5 are randomly selected from eligible participants
- Existing participant import, duplicate prevention, include/exclude, no-repeat setting
- Winner history (without selection-method labels), undo last confirmed draw and CSV export; audit records are hidden from the interface and retained in JSON backup data
- JSON backup and restore (Admin settings are hidden from the main navigation; open with Ctrl+Shift+A or click the app title five times)
- Local browser storage and offline PWA support after first successful load

IMPORTANT
For installation and offline PWA features, host the files on an HTTPS static website (for example GitHub Pages). Opening index.html directly works as a normal webpage but does not enable PWA installation or service workers.

DEPLOYMENT
Upload all six files to the root of a GitHub repository and enable GitHub Pages from Settings > Pages > Deploy from a branch > main > /(root).

DATA
Participant names and draw records are stored locally in the browser on the device being used. Download a JSON backup before changing devices or clearing browser data. The audit log is an operational record stored in the same local browser storage; it is not tamper-proof or a secure external audit system.

UPDATE NOTE
If the PWA was previously installed, close and reopen it while online to allow the updated service worker (v6) to refresh the app files.

DISPLAY PRIVACY
The audit log is not shown in the app interface. Winner history and its CSV export show only the winner name, prize and time; they do not display the selection method. Internal selection metadata remains in local storage and JSON backups.

Version 6: Explicitly hides any Audit Log navigation tab or audit-log section in the interface and refreshes the service-worker cache.

Version 8 update: Admin settings now support an optional preselected participant for each prize (1st through 5th). Use Enable/Disable for each prize; disabled prizes are randomly drawn. Preselected selection method is retained in internal records and backups.

Presentation view: click anywhere on the screen to start the current prize draw. The exit control and winner confirmation dialog remain interactive.

Version 14: Enhanced original slot-machine reel clicks, richer casino-show looping music, and a bigger jackpot fanfare.
