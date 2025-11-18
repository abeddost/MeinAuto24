# 🚗 MeinAutoPreis24

Eine vollständige Webanwendung zum Verkauf von Autos mit mehrstufigem Formular, Bild-Upload und E-Mail-Benachrichtigungen. Basierend auf [https://meinautopreis24.de/](https://meinautopreis24.de/).

## ✨ Features

- ✅ **Mehrstufiges Formular** - 4 Schritte mit Progress-Bar und Validierung
- ✅ **Bild-Upload** - Drag & Drop, bis zu 5 Bilder (5MB pro Bild)
- ✅ **E-Mail-Benachrichtigungen** - Bestätigung an Kunden & Benachrichtigung an Admin
- ✅ **Responsive Design** - Optimiert für Desktop, Tablet & Mobile
- ✅ **RESTful API** - Express.js Backend mit Validation
- ✅ **Sichere Datei-Uploads** - Multer mit Größen- und Typ-Validierung
- ✅ **Moderne UI** - Clean Design mit Animationen

## 🛠 Technologie-Stack

### Backend
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **Multer** - File Upload Handling
- **Nodemailer** - Email Versand
- **Express-Validator** - Eingabe-Validierung

### Frontend
- **HTML5** - Semantisches Markup
- **CSS3** - Modern Styling mit Flexbox & Grid
- **Vanilla JavaScript** - Keine Frameworks nötig

## 📦 Installation

### Voraussetzungen
- Node.js (v14 oder höher)
- npm oder yarn

### Schritt 1: Repository klonen
```bash
git clone <your-repo-url>
cd meinautopreis24
```

### Schritt 2: Abhängigkeiten installieren
```bash
npm install
```

### Schritt 3: Umgebungsvariablen konfigurieren
```bash
# .env.example zu .env kopieren
cp .env.example .env
```

Bearbeiten Sie `.env` und tragen Sie Ihre SMTP-Daten ein:

```env
PORT=3000

# Gmail-Konfiguration (Beispiel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ihre-email@gmail.com
SMTP_PASS=ihr-app-passwort
ADMIN_EMAIL=admin@meinautopreis24.de

NODE_ENV=development
```

#### Gmail App-Passwort erstellen:
1. Google-Konto aufrufen → Sicherheit
2. 2-Faktor-Authentifizierung aktivieren
3. App-Passwörter erstellen: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Generiertes Passwort als `SMTP_PASS` verwenden

## 🚀 Verwendung

### Entwicklungsmodus
```bash
npm run dev
```
Server läuft auf `http://localhost:3000` mit automatischem Neustart bei Änderungen.

### Produktionsmodus
```bash
npm start
```

## 📁 Projektstruktur

```
meinautopreis24/
├── server.js                 # Express Server Entry Point
├── package.json              # Projekt-Dependencies
├── .env                      # Umgebungsvariablen (nicht in Git)
├── .env.example             # Beispiel für Umgebungsvariablen
├── .gitignore               # Git Ignore Regeln
├── README.md                # Diese Datei
│
├── public/                   # Frontend Static Files
│   ├── index.html           # Haupt-HTML-Seite
│   ├── styles.css           # Styling
│   └── script.js            # Client-seitiges JavaScript
│
├── routes/
│   └── api.js               # API-Endpunkte
│
├── controllers/
│   └── offerController.js   # Business Logic für Angebote
│
├── middleware/
│   └── upload.js           # Multer File Upload Config
│
├── utils/
│   └── emailService.js     # E-Mail-Versand-Funktionen
│
└── uploads/                 # Hochgeladene Bilder (wird erstellt, nicht in Git)
```

## 🔌 API-Endpunkte

### POST `/api/submit-offer`
Übermittelt ein neues Fahrzeugangebot.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Alle Formularfelder + bis zu 5 Bilddateien

**Response:**
```json
{
  "success": true,
  "message": "Ihr Angebot wurde erfolgreich übermittelt...",
  "offerId": "1234567890"
}
```

### GET `/api/health`
Healthcheck-Endpunkt.

**Response:**
```json
{
  "status": "OK",
  "message": "Server ist erreichbar"
}
```

## 📧 E-Mail-Funktionalität

Das System versendet zwei E-Mails pro Angebot:

1. **Bestätigungs-E-Mail an Kunden**
   - Danke für das Angebot
   - Zusammenfassung der eingegebenen Daten
   - Kontaktinformationen

2. **Benachrichtigungs-E-Mail an Admin**
   - Vollständige Angebotsdaten
   - Kundenkontaktdaten
   - Anzahl der hochgeladenen Bilder

## 🔒 Sicherheit

- **Input Validation** - Express-Validator für alle Formulareingaben
- **File Upload Limits** - Max. 5 Bilder, 5MB pro Datei
- **File Type Validation** - Nur Bildformate erlaubt (JPEG, PNG, GIF, WEBP)
- **CORS** - Konfigurierbar für Produktionsumgebungen
- **Error Handling** - Zentrale Error-Handler

## 🎨 Anpassungen

### Logo ändern
Bearbeiten Sie `public/index.html`, Zeile 12-14.

### Farben anpassen
Bearbeiten Sie `public/styles.css`, CSS-Variablen in Zeilen 7-19.

### E-Mail-Templates
Bearbeiten Sie `utils/emailService.js`.

### Formularfelder hinzufügen
1. HTML in `public/index.html` hinzufügen
2. Validation in `routes/api.js` anpassen
3. Controller in `controllers/offerController.js` updaten

## 🐛 Troubleshooting

### E-Mails werden nicht versendet
- Überprüfen Sie SMTP-Credentials in `.env`
- Stellen Sie sicher, dass 2FA aktiviert ist (Gmail)
- Verwenden Sie ein App-Passwort, nicht Ihr Haupt-Passwort
- Prüfen Sie Firewall-Einstellungen für Port 587

### Uploads funktionieren nicht
- Stellen Sie sicher, dass der `uploads/` Ordner existiert
- Überprüfen Sie Dateigrößen (Max. 5MB)
- Prüfen Sie Dateitypen (nur Bilder erlaubt)

### Port bereits in Verwendung
```bash
# Port in .env ändern oder anderen Prozess beenden
PORT=3001 npm start
```

## 🚀 Deployment

### Heroku
```bash
heroku create meinautopreis24
heroku config:set SMTP_HOST=... SMTP_USER=... SMTP_PASS=...
git push heroku main
```

### VPS (nginx + PM2)
```bash
# PM2 installieren
npm install -g pm2

# App starten
pm2 start server.js --name meinautopreis24

# PM2 beim Systemstart starten
pm2 startup
pm2 save
```

## 📝 Nächste Schritte

- [ ] Datenbank-Integration (MongoDB/PostgreSQL)
- [ ] Admin-Dashboard für Angebotsverwaltung
- [ ] Bildoptimierung/Thumbnail-Generierung
- [ ] PDF-Generierung für Angebote
- [ ] SMS-Benachrichtigungen (Twilio)
- [ ] A/B Testing
- [ ] Analytics-Integration (Google Analytics)
- [ ] Cookie-Consent-Banner
- [ ] Multi-Language Support

## 📄 Lizenz

ISC

## 🤝 Support

Bei Fragen oder Problemen:
- E-Mail: support@meinautopreis24.de
- Telefon: +49 (0) 123 456789

---

**Entwickelt mit ❤️ für MeinAutoPreis24**

