


// // const express = require('express');
// // const bodyParser = require('body-parser');
// // const crypto = require('crypto');
// // const fs = require('fs');
// // const path = require('path');

// // const app = express();


// // const dataFile = path.join(__dirname, 'data.json');

// // // Middleware pour analyser les corps de requête et servir des fichiers statiques
// // app.set('view engine', 'ejs');
// // app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(express.static(path.join(__dirname, 'public')));

// // // Fonction pour charger les données du fichier JSON
// // const loadData = () => {
// //     if (fs.existsSync(dataFile)) {
// //         const jsonData = fs.readFileSync(dataFile, 'utf-8');
// //         return JSON.parse(jsonData);
// //     } else {
// //         return {};
// //     }
// // };

// // // Fonction pour sauvegarder les données dans le fichier JSON
// // const saveData = (data) => {
// //     fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
// // };

// // // Fonction pour générer un identifiant unique
// // const generateId = () => {
// //     return crypto.randomBytes(3).toString('hex');
// // };

// // // Route pour la page d'accueil
// // app.get('/', (req, res) => {
// //     res.render('index');
// // });

// // // Route pour raccourcir une URL
// // app.post('/shorten', (req, res) => {
// //     const originalUrl = req.body.url;
// //     const data = loadData();

// //     // Vérifier si l'URL existe déjà dans la base de données
// //     const existingShortUrl = Object.keys(data).find(key => data[key] === originalUrl);
// //     if (existingShortUrl) {
// //         const shortUrl = `${req.protocol}://${req.get('host')}/${existingShortUrl}`;
// //         return res.render('result', { shortUrl });
// //     }

// //     // Générer un nouvel identifiant court unique
// //     const shortId = generateId();
// //     const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;

// //     // Ajouter l'URL à la base de données
// //     data[shortId] = originalUrl;

// //     // Sauvegarder les données mises à jour
// //     saveData(data);

// //     // Afficher la page de résultat avec l'URL raccourcie
// //     res.render('result', { shortUrl });
// // });

// // // Route pour rediriger vers l'URL originale à partir de l'identifiant court
// // app.get('/:shortId', (req, res) => {
// //     const shortId = req.params.shortId;
// //     const data = loadData();

// //     // Trouver l'URL originale correspondant à l'identifiant court
// //     const originalUrl = data[shortId];
// //     if (originalUrl) {
// //         res.redirect(originalUrl);
// //     } else {
// //         res.status(404).send('URL non trouvée');
// //     }
// // });

// // // Écouter le serveur sur le port spécifié


// // const port = 3002;

// // app.listen(port, function () {
// //   console.log(`l'application ecoute sur le port ${port}`);
// //   console.log(`l'application est disponible sur http://localhost:${port}`);
// // });



// const express = require("express");
// const bodyParser = require('body-parser');
// const QRCode = require('qrcode');

// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.set("views", __dirname + "/views");

// let allURL = [];
// let deletedURLs = [];

// function generateShortURL() {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let shortURL = '';
//     for (let i = 0; i < 6; i++) {
//         shortURL += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return shortURL;
// }

// app.get("/", (req, res) => {
//     let message = ""; // Initialise message ici
//     res.render("index", { message });
// });

// app.post("/ajouterURL", async (req, res) => {
//     const urlLong = req.body.urlLong;

//     // Vérifie si l'URL longue existe déjà dans allURL
//     const existingURL = allURL.find(urlObj => urlObj.urlLong === urlLong);

//     if (existingURL) {
//         let message = "URL longue déjà utilisée. Utilisez l'URL courte : " + existingURL.urlCourt;
//         res.render("index", { message });
//         return;
//     }

//     // Vérifie si l'URL longue existe dans deletedURLs
//     const deletedURL = deletedURLs.find(urlObj => urlObj.urlLong === urlLong);
//     let urlCourt;
//     if (deletedURL) {
//         urlCourt = deletedURL.urlCourt;
//         // Supprime l'entrée de deletedURLs car elle est réutilisée
//         deletedURLs = deletedURLs.filter(urlObj => urlObj.urlLong !== urlLong);
//     } else {
//         urlCourt = generateShortURL();
//         // Assure l'unicité de l'URL courte générée
//         while (allURL.find(urlObj => urlObj.urlCourt === urlCourt)) {
//             urlCourt = generateShortURL();
//         }
//     }

//     const qrCodeDataURL = await QRCode.toDataURL(urlLong);
//     let id = (new Date()).getTime().toString(16);

//     const newURL = {
//         id,
//         urlLong,
//         urlCourt,
//         codeQR: qrCodeDataURL
//     };

//     allURL.push(newURL);

//     allURLResponse();
//     res.redirect("/ajouterURL");
// });

// app.get("/ajouterURL", async (req, res) => {
//     allURLResponse();
//     res.render("allURL", { allURL });
// });

// function allURLResponse() {
//     for (let i = 0; i < allURL.length; i++) {
//         app.get("/" + allURL[i].urlCourt, (req, res) => {
//             res.redirect(allURL[i].urlLong);
//         });
//     }
// }

// app.delete("/supprimer/:id", (req, res) => {
//     const { id } = req.params;
//     const urlIndex = allURL.findIndex((urlObj) => urlObj.id === id);

//     if (urlIndex !== -1) {
//         // Ajoute l'URL supprimée à deletedURLs pour pouvoir la réutiliser
//         deletedURLs.push(allURL[urlIndex]);
//         allURL.splice(urlIndex, 1);
//     }

//     allURLResponse();
//     res.redirect("/ajouterURL");
// });

// const port = 3002;
// app.listen(port, function () {
//     console.log(`l'application écoute sur le port ${port}`);
//     console.log(`l'application est disponible sur http://localhost:${port}`);
// });

// fonction
// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const QRCode = require('qrcode');
// const path = require('path');

// const app = express();
// const PORT = 3002;
// const dataFilePath = path.join(__dirname, 'data.json');

// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// let urlData = [];

// // Charger les données depuis data.json au démarrage
// if (fs.existsSync(dataFilePath)) {
//     try {
//         const data = fs.readFileSync(dataFilePath, 'utf8');
//         urlData = JSON.parse(data);
//     } catch (error) {
//         console.error("Erreur de lecture du fichier data.json", error);
//     }
// } else {
//     // Si le fichier n'existe pas, créer un fichier vide
//     fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
// }

// app.get('/', (req, res) => {
//     res.render('index', { urls: urlData });
// });

// app.post('/shorten', async (req, res) => {
//     const longUrl = req.body.longUrl;
//     let shortUrlData = urlData.find(data => data.longUrl === longUrl);

//     if (!shortUrlData) {
//         const shortUrl = `http://short.url/${urlData.length + 1}`;
//         const qrCode = await QRCode.toDataURL(shortUrl);

//         shortUrlData = { id: urlData.length + 1, longUrl, shortUrl, qrCode };
//         urlData.push(shortUrlData);
//         fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
//     }

//     res.render('result', { shortUrlData });
// });

// app.post('/delete', (req, res) => {
//     const id = parseInt(req.body.id);
//     urlData = urlData.filter(data => data.id !== id);
//     fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
//     res.redirect('/');
// });


// const port = 3002;
// app.listen(port, function () {
//     console.log(`l'application écoute sur le port ${port}`);
//     console.log(`l'application est disponible sur http://localhost:${port}`);
// });

// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const QRCode = require('qrcode');
// const path = require('path');

// const app = express();
// const PORT = 3002;
// const dataFilePath = path.join(__dirname, 'data', 'db.json');

// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// let urlData = [];

// // Charger les données depuis db.json au démarrage
// if (fs.existsSync(dataFilePath)) {
//     try {
//         const data = fs.readFileSync(dataFilePath, 'utf8');
//         urlData = JSON.parse(data);
//     } catch (error) {
//         console.error("Erreur de lecture du fichier db.json", error);
//     }
// } else {
//     // Si le fichier n'existe pas, créer un fichier vide
//     fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
// }

// app.get('/', (req, res) => {
//     res.render('index', { urls: urlData });
// });

// app.post('/shorten', async (req, res) => {
//     const longUrl = req.body.longUrl;
//     let shortUrlData = urlData.find(data => data.longUrl === longUrl);

//     if (!shortUrlData) {
//         const shortUrl = `http://short.url/${urlData.length + 1}`;
//         const qrCode = await QRCode.toDataURL(shortUrl);

//         shortUrlData = { id: urlData.length + 1, longUrl, shortUrl, qrCode };
//         urlData.push(shortUrlData);
//         fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
//     }

//     res.render('result', { shortUrlData });
// });

// app.post('/delete', (req, res) => {
//     const id = parseInt(req.body.id);
//     urlData = urlData.filter(data => data.id !== id);
//     fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
//     res.redirect('/');
// });


// app.listen(PORT, () => {
//     console.log(`L'application écoute sur le port ${PORT}`);
//     console.log(`L'application est disponible sur http://localhost:${PORT}`);
// });



// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const QRCode = require('qrcode');
// const path = require('path');

// const app = express();
// const PORT = 3002;
// const dataFilePath = path.join(__dirname, 'data', 'db.json');

// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// let urlData = [];

// // Charger les données depuis db.json au démarrage
// if (fs.existsSync(dataFilePath)) {
//     try {
//         const data = fs.readFileSync(dataFilePath, 'utf8');
//         urlData = JSON.parse(data);
//     } catch (error) {
//         console.error("Erreur de lecture du fichier db.json", error);
//     }
// } else {
//     // Si le fichier n'existe pas, créer un fichier vide
//     fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
// }

// app.get('/', (req, res) => {
//     res.render('index');
// });

// app.post('/shorten', async (req, res) => {
//     const longUrl = req.body.longUrl;
//     let shortUrlData = urlData.find(data => data.longUrl === longUrl);

//     if (!shortUrlData) {
//         const shortUrl = `http://short.url/${urlData.length + 1}`;
//         const qrCodePng = await QRCode.toDataURL(shortUrl);

//         shortUrlData = { id: urlData.length + 1, longUrl, shortUrl, qrCodePng };
//         urlData.push(shortUrlData);
//         fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
//     }

//     res.redirect('/list');
// });

// app.get('/list', (req, res) => {
//     res.render('list', { urls: urlData });
// });

// app.post('/delete', (req, res) => {
//     const id = parseInt(req.body.id);
//     urlData = urlData.filter(data => data.id !== id);
//     fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
//     res.redirect('/list');
// });

// app.listen(PORT, () => {
//     console.log(`L'application écoute sur le port ${PORT}`);
//     console.log(`L'application est disponible sur http://localhost:${PORT}`);
// });

// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const QRCode = require('qrcode');
// const path = require('path');

// const app = express();
// const PORT = 3002;
// const dataFilePath = path.join(__dirname, 'data', 'db.json');

// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// let urlData = [];

// // Charger les données depuis db.json au démarrage
// if (fs.existsSync(dataFilePath)) {
//     try {
//         const data = fs.readFileSync(dataFilePath, 'utf8');
//         urlData = JSON.parse(data);
//     } catch (error) {
//         console.error("Erreur de lecture du fichier db.json", error);
//     }
// } else {
//     // Si le fichier n'existe pas, créer un fichier vide
//     fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
// }

// app.get('/', (req, res) => {
//     res.render('index', { urls: urlData }); // Passer urlData à index.ejs
// });

// app.post('/shorten', async (req, res) => {
//     const longUrl = req.body.longUrl;
//     let shortUrlData = urlData.find(data => data.longUrl === longUrl);

//     if (!shortUrlData) {
//         const id = generateRandomId(); // Génère un identifiant unique
//         const shortUrl = `${req.protocol}://${req.get('host')}/${id}`;
//         const qrCodePng = await QRCode.toDataURL(shortUrl);

//         shortUrlData = { id, longUrl, shortUrl, qrCodePng };
//         urlData.push(shortUrlData);
//         fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
//     }

//     res.redirect('/list');
// });

// app.get('/list', (req, res) => {
//     res.render('list', { urls: urlData });
// });

// app.get('/:id', (req, res) => {
//     const id = req.params.id;
//     const urlEntry = urlData.find(data => data.id === id);

//     if (urlEntry) {
//         res.redirect(urlEntry.longUrl);
//     } else {
//         res.status(404).send('URL non trouvée');
//     }
// });

// app.post('/delete', (req, res) => {
//     const id = req.body.id;
//     urlData = urlData.filter(data => data.id !== id);
//     fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
//     res.redirect('/list');
// });

// app.listen(PORT, () => {
//     console.log(`L'application écoute sur le port ${PORT}`);
//     console.log(`L'application est disponible sur http://localhost:${PORT}`);
// });

// function generateRandomId() {
//     return Math.random().toString(36).substring(2, 8);
// }


// const express = require("express");
// const bodyParser = require('body-parser');
// const fs = require("fs");
// const path = require("path");
// const QRCode = require('qrcode');

// const app = express();
// const port = 3002;
// const dataFilePath = path.join(__dirname, 'data', 'db.json');


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.set("views", __dirname + "/views");

// let allURL = [];
// let deletedURLs = [];

// // Charger les données depuis db.json au démarrage
// if (fs.existsSync(dataFilePath)) {
//     try {
//         const data = fs.readFileSync(dataFilePath, 'utf8');
//         allURL = JSON.parse(data);
//     } catch (error) {
//         console.error("Erreur de lecture du fichier db.json", error);
//     }
// } else {
//     // Si le fichier n'existe pas, créer un fichier vide
//     fs.writeFileSync(dataFilePath, JSON.stringify(allURL, null, 2));
// }

// function generateShortURL() {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let shortURL = '';
//     for (let i = 0; i < 6; i++) {
//         shortURL += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return shortURL;
// }

// app.get("/", (req, res) => {
//     let message = "";
//     res.render("index", { message });
// });

// app.post("/ajouterURL", async (req, res) => {
//     const urlLong = req.body.urlLong;

//     const existingURL = allURL.find(urlObj => urlObj.urlLong === urlLong);

//     if (existingURL) {
//         let message = "URL longue déjà utilisée. Utilisez l'URL courte : " + existingURL.urlCourt;
//         res.render("index", { message });
//         return;
//     }

//     const deletedURL = deletedURLs.find(urlObj => urlObj.urlLong === urlLong);
//     let urlCourt;
//     if (deletedURL) {
//         urlCourt = deletedURL.urlCourt;
//         deletedURLs = deletedURLs.filter(urlObj => urlObj.urlLong !== urlLong);
//     } else {
//         urlCourt = generateShortURL();
//         while (allURL.find(urlObj => urlObj.urlCourt === urlCourt)) {
//             urlCourt = generateShortURL();
//         }
//     }

//     const qrCodeDataURL = await QRCode.toDataURL(urlLong);
//     let id = (new Date()).getTime().toString(16);

//     const newURL = {
//         id,
//         urlLong,
//         urlCourt,
//         codeQR: qrCodeDataURL
//     };

//     allURL.push(newURL);

//     // Sauvegarder les données dans db.json
//     fs.writeFileSync(dataFilePath, JSON.stringify(allURL, null, 2));

//     allURLResponse();
//     res.redirect("/ajouterURL");
// });

// app.get("/ajouterURL", (req, res) => {
//     allURLResponse();
//     res.render("allURL", { allURL });
// });

// function allURLResponse() {
//     allURL.forEach(urlObj => {
//         app.get("/" + urlObj.urlCourt, (req, res) => {
//             res.redirect(urlObj.urlLong);
//         });
//     });
// }

// app.delete("/supprimer/:id", (req, res) => {
//     const { id } = req.params;
//     const urlIndex = allURL.findIndex(urlObj => urlObj.id === id);

//     if (urlIndex !== -1) {
//         deletedURLs.push(allURL[urlIndex]);
//         allURL.splice(urlIndex, 1);
//     }

//     // Sauvegarder les données dans db.json
//     fs.writeFileSync(dataFilePath, JSON.stringify(allURL, null, 2));

//     allURLResponse();
//     res.redirect("/ajouterURL");
// });

// app.listen(port, function () {
//     console.log(`l'application écoute sur le port ${port}`);
//     console.log(`l'application est disponible sur http://localhost:${port}`);
// });

const express = require("express");
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));
app.use(express.static('public'));

const dataFilePath = path.join(__dirname, 'db.json');
let allURL = [];
let urls = [];

let deletedURLs = [];

// Charger les données depuis le fichier db.json au démarrage de l'application
if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath);
    allURL = JSON.parse(data);
}

function generateShortURL() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortURL = '';
    for (let i = 0; i < 6; i++) {
        shortURL += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shortURL;
}

app.get("/", (req, res) => {
    let message = "";
    res.render("index", { message, allURL });
});

app.post("/ajouterURL", async (req, res) => {
    const urlLong = req.body.urlLong;

    const existingURL = allURL.find(urlObj => urlObj.urlLong === urlLong);

    if (existingURL) {
        let message = "URL longue déjà utilisée. Utilisez l'URL courte : " + existingURL.urlCourt;
        res.render("index", { message, allURL });
        return;
    }

    const deletedURL = deletedURLs.find(urlObj => urlObj.urlLong === urlLong);
    let urlCourt;
    if (deletedURL) {
        urlCourt = deletedURL.urlCourt;
        deletedURLs = deletedURLs.filter(urlObj => urlObj.urlLong !== urlLong);
    } else {
        urlCourt = generateShortURL();
        while (allURL.find(urlObj => urlObj.urlCourt === urlCourt)) {
            urlCourt = generateShortURL();
        }
    }

    const qrCodeDataURL = await QRCode.toDataURL(urlLong);
    let id = (new Date()).getTime().toString(16);

    const newURL = {
        id,
        urlLong,
        urlCourt,
        codeQR: qrCodeDataURL
    };

    allURL.push(newURL);

    // Sauvegarder les données dans db.json
    fs.writeFileSync(dataFilePath, JSON.stringify(allURL, null, 2));

    allURLResponse();
    res.redirect("/ajouterURL");
});

app.get("/ajouterURL", async (req, res) => {
    allURLResponse();
    res.render("allURL", { allURL });
});

function allURLResponse() {
    for (let i = 0; i < allURL.length; i++) {
        app.get("/" + allURL[i].urlCourt, (req, res) => {
            res.redirect(allURL[i].urlLong);
        });
    }
}

app.delete("/supprimer/:id", (req, res) => {
    const { id } = req.params;
    const urlIndex = allURL.findIndex(urlObj => urlObj.id === id);

    if (urlIndex !== -1) {
        deletedURLs.push(allURL[urlIndex]);
        allURL.splice(urlIndex, 1);

        // Sauvegarder les données dans db.json
        fs.writeFileSync(dataFilePath, JSON.stringify(allURL, null, 2));

        allURLResponse();
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "URL non trouvée." });
    }
});


const port = 3002;
app.listen(port, function () {
    console.log(`L'application écoute sur le port ${port}`);
    console.log(`L'application est disponible sur http://localhost:${port}`);
});

// const express = require("express");
// const bodyParser = require('body-parser');
// const QRCode = require('qrcode');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static('public'));
// app.use(express.static('public'));

// const dataFilePath = path.join(__dirname, 'db.json');
// let allURL = [];
// let urls = [];

// let deletedURLs = [];

// // Charger les données depuis le fichier db.json au démarrage de l'application
// if (fs.existsSync(dataFilePath)) {
//     const data = fs.readFileSync(dataFilePath);
//     allURL = JSON.parse(data);
// }

// function generateShortURL() {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let shortURL = '';
//     for (let i = 0; i < 6; i++) {
//         shortURL += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return shortURL;
// }

// app.get("/", (req, res) => {
//     let message = "";
//     res.render("index", { message, allURL });
// });

// app.post("/ajouterURL", async (req, res) => {
//     const urlLong = req.body.urlLong;

//     const existingURL = allURL.find(urlObj => urlObj.urlLong === urlLong);

//     if (existingURL) {
//         let message = "URL longue déjà utilisée. Utilisez l'URL courte : " + existingURL.urlCourt;
//         res.render("index", { message, allURL });
//         return;
//     }

//     const deletedURL = deletedURLs.find(urlObj => urlObj.urlLong === urlLong);
//     let urlCourt;
//     if (deletedURL) {
//         urlCourt = deletedURL.urlCourt;
//         deletedURLs = deletedURLs.filter(urlObj => urlObj.urlLong !== urlLong);
//         let message = `URL récupérée avec succès. URL courte : ${urlCourt}`;
//         res.render("index", { message, allURL });
//         return;
//     } else {
//         urlCourt = generateShortURL();
//         while (allURL.find(urlObj => urlObj.urlCourt === urlCourt)) {
//             urlCourt = generateShortURL();
//         }
//     }

//     const qrCodeDataURL = await QRCode.toDataURL(urlLong);
//     let id = (new Date()).getTime().toString(16);

//     const newURL = {
//         id,
//         urlLong,
//         urlCourt,
//         codeQR: qrCodeDataURL
//     };

//     allURL.push(newURL);

//     // Sauvegarder les données dans db.json
//     fs.writeFileSync(dataFilePath, JSON.stringify(allURL, null, 2));

//     allURLResponse();
//     res.redirect("/ajouterURL");
// });

// app.get("/ajouterURL", async (req, res) => {
//     allURLResponse();
//     res.render("allURL", { allURL });
// });

// function allURLResponse() {
//     for (let i = 0; i < allURL.length; i++) {
//         app.get("/" + allURL[i].urlCourt, (req, res) => {
//             res.redirect(allURL[i].urlLong);
//         });
//     }
// }

// app.delete("/supprimer/:id", (req, res) => {
//     const { id } = req.params;
//     const urlIndex = allURL.findIndex(urlObj => urlObj.id === id);

//     if (urlIndex !== -1) {
//         deletedURLs.push(allURL[urlIndex]);
//         allURL.splice(urlIndex, 1);

//         // Sauvegarder les données dans db.json
//         fs.writeFileSync(dataFilePath, JSON.stringify(allURL, null, 2));

//         allURLResponse();
//         res.json({ success: true });
//     } else {
//         res.json({ success: false, message: "URL non trouvée." });
//     }
// });

// const port = 3002;
// app.listen(port, function () {
//     console.log(`L'application écoute sur le port ${port}`);
//     console.log(`L'application est disponible sur http://localhost:${port}`);
// });
