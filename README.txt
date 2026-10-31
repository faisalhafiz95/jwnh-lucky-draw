JWNH LUCKY DRAW 2026 - FESTIVE PWA

Files:
- index.html: application interface
- app.js: draw logic, participant management, confirmation, history and audit
- manifest.webmanifest: installable app settings
- sw.js: offline caching (cache version v2)
- icon.svg: application icon

FEATURES
- Festive red and gold theme
- Dramatic synthesized sound effects and optional original background music
- Rapid rolling-name animation with a large winner reveal and confetti
- Winner confirmation prompt: Try Again / Next Prize
- 1st Prize remains organiser-selected (default recipient Sal); the method is recorded
- Prizes 2-5 are randomly selected from eligible participants
- Existing participant import, duplicate prevention, include/exclude, no-repeat setting
- Winner history, undo last confirmed draw, audit log and CSV exports
- JSON backup and restore
- Local browser storage and offline PWA support after first successful load

IMPORTANT
For installation and offline PWA features, host the files on an HTTPS static website (for example GitHub Pages). Opening index.html directly works as a normal webpage but does not enable PWA installation or service workers.

DEPLOYMENT
Upload all six files to the root of a GitHub repository and enable GitHub Pages from Settings > Pages > Deploy from a branch > main > /(root).

DATA
Participant names and draw records are stored locally in the browser on the device being used. Download a JSON backup before changing devices or clearing browser data. The audit log is an operational record stored in the same local browser storage; it is not tamper-proof or a secure external audit system.

UPDATE NOTE
If the PWA was previously installed, close and reopen it while online to allow the updated service worker (v2) to refresh the app files.
