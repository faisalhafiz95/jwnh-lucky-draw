JWNH Lucky Draw PWA - Setup

IMPORTANT:
A Progressive Web App must be served from HTTPS (or localhost) to install and use offline caching.
Opening index.html directly as a file will run the web app, but PWA installation/service-worker offline support will not be available.

EASIEST DEPLOYMENT:
1. Upload the contents of this folder to a static HTTPS host, keeping the files in the same folder.
2. Open the hosted index.html URL in Google Chrome.
3. Import the staff CSV or paste names.
4. Use Chrome's Install icon in the address bar, or the app's Install app button if shown.
5. After the first successful load, open it once while online so the service worker can cache the app. It can then be used offline.

LOCAL TEST:
Run a local web server from this folder, then open http://localhost:8000 in Chrome:
  python -m http.server 8000
This is for testing only; other devices cannot access localhost on your laptop.

FEATURES:
- Local browser storage for participants and winner history.
- CSV import/export and JSON backup/restore.
- Sound effects generated locally.
- Presentation mode.
- 1st Prize organiser-selected recipient setting in Admin Settings; selection method is retained in winner records.
- 2nd to 5th prizes use random selection.
- No-repeat option.

The app stores data in the browser profile on that device. Export a JSON backup before changing computers or clearing browser data.
