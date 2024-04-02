// Importation des modules nécessaires
const http = require('http'); // Module HTTP de Node.js pour créer le serveur
const fs = require('fs'); // Module FileSystem pour lire les fichiers
const path = require('path'); // Module Path pour travailler avec les chemins de fichiers
const port = 8080; // Numéro de port sur lequel le serveur écoutera


// Création du serveur HTTP
const server = http.createServer(function(req, res) 
{
    // Construction du chemin du fichier demandé en ajoutant '.' devant l'URL
    let filePath = '.' + req.url;

    // Si aucun fichier spécifique n'est demandé, servir index.html par défaut
    if (filePath === './') 
    {
        filePath = './index.html';
    }

    // Détermination du type de contenu en fonction de l'extension du fichier
    const extname = path.extname(filePath);
    let contentType = 'text/html'; // Par défaut, le contenu est HTML

    switch (extname) 
    {
        case '.js':
            contentType = 'text/javascript'; // Si l'extension est .js, le contenu est JavaScript
            break;
        case '.css':
            contentType = 'text/css'; // Si l'extension est .css, le contenu est CSS
            break;
    }

    // Lecture du fichier demandé
    fs.readFile(filePath, function(error, content) 
    {
        if (error) 
        {
            // Si une erreur se produit lors de la lecture du fichier
            if (error.code == 'ENOENT') 
            {
                // Si le fichier n'est pas trouvé, retourner une erreur 404
                res.writeHead(404);
                res.end('Error: File Not Found');
            } 
            else 
            {
                // Si une autre erreur se produit, retourner une erreur 500
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        }
        else 
        {
            // Si la lecture du fichier est réussie, retourner le contenu avec le bon type de contenu
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Lancement du serveur et écoute des connexions sur le port spécifié
server.listen(port, function() 
{
    console.log('Server running at http://localhost:8080/');
});
