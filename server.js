require('dotenv').config();

const http = require('http');
const url = require('url');
const fs = require('fs');

const { readRecipes } = require('./utils/fileHelper');

const PORT = process.env.PORT || 3000;

// === Démonstration de l'Event Loop ===
// fs.readFile est non-bloquant.
// Node.js peut continuer à traiter d'autres tâches pendant la lecture du fichier.

const server = http.createServer((req, res) => {

  // ===== BONUS : logger chaque requête =====
  const logLine = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;

  fs.appendFile('server.log', logLine, (err) => {
    if (err) {
      console.error('Erreur log:', err.message);
    }
  });

  // Parser l'URL manuellement
  const parsedUrl = url.parse(req.url, true);

  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  res.setHeader('Content-Type', 'application/json');

  //  GET / 
  if (req.method === 'GET' && pathname === '/') {

    res.writeHead(200);

    res.end(
      JSON.stringify({
        message: 'Bienvenue sur le Food Recipe Logger API !'
      })
    );
  }

  //  GET /recipes 
  else if (req.method === 'GET' && pathname === '/recipes') {

    // Démonstration Event Loop
    console.log("après l'appel readRecipes");

    readRecipes((err, data) => {

      // Ce callback s'exécute plus tard
      if (err) {

        res.writeHead(500);

        return res.end(
          JSON.stringify({
            error: 'Erreur lecture fichier'
          })
        );
      }

      let recipes = data.recipes;

      // Filtre par cuisine
      if (query.cuisine) {

        recipes = recipes.filter(r =>
          r.cuisine.toLowerCase() ===
          query.cuisine.toLowerCase()
        );
      }

      res.writeHead(200);

      res.end(JSON.stringify({ recipes }));
    });
  }

  //  BONUS GET /recipes/:id 
  else if (
    req.method === 'GET' &&
    pathname.startsWith('/recipes/')
  ) {

    const id = parseInt(pathname.split('/')[2]);

    readRecipes((err, data) => {

      if (err) {

        res.writeHead(500);

        return res.end(
          JSON.stringify({
            error: 'Erreur lecture fichier'
          })
        );
      }

      const recipe = data.recipes.find(r => r.id === id);

      if (!recipe) {

        res.writeHead(404);

        return res.end(
          JSON.stringify({
            error: 'Recette introuvable'
          })
        );
      }

      res.writeHead(200);

      res.end(JSON.stringify(recipe));
    });
  }

  //  404 
  else {

    res.writeHead(404);

    res.end(
      JSON.stringify({
        error: 'Route introuvable'
      })
    );
  }
});

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});