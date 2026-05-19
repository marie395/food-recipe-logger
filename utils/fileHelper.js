const fs = require('fs');
const path = require('path');

// Chemin absolu vers recipes.json — path.join garantit la compatibilité Windows/Linux
const recipesPath = path.join(__dirname, '..', 'recipes.json');

// Lire les recettes de façon asynchrone (non-bloquant)
function readRecipes(callback) {
  fs.readFile(recipesPath, 'utf8', (err, data) => {
    if (err) return callback(err, null);
    callback(null, JSON.parse(data));
  });
}

// Écrire les recettes de façon asynchrone
function writeRecipes(data, callback) {
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFile(recipesPath, jsonString, 'utf8', (err) => {
    callback(err);
  });
}

module.exports = { readRecipes, writeRecipes };


//1. fs.readFile vs fs.readFileSync ?
//fs.readFileSync bloque tout le processus Node.js jusqu'à la fin de la lecture — 
// aucune autre requête ne peut être traitée pendant ce temps. fs.readFile est asynchrone : Node.js lance la lecture,
//  continue à exécuter d'autres tâches (traiter d'autres requêtes HTTP, par exemple), 
// puis appelle le callback quand la lecture est terminée. Dans un serveur, on utilise toujours 
// fs.readFile pour ne pas bloquer les autres utilisateurs.
//2. module.exports et pourquoi diviser en modules ?
//module.exports expose les fonctions d'un fichier pour qu'un autre fichier puisse les require().
//  On divise le code en modules pour : réutilisabilité (fileHelper utilisé dans cli.js ET server.js),
//  lisibilité, et séparation des responsabilités — chaque fichier a un rôle précis.
//3. Pourquoi ne jamais commiter .env ?
//Le .env contient des secrets : mots de passe, clés API, tokens. Si on le met sur GitHub,
//  n'importe qui peut lire ces secrets. Le .env.example (sans vraies valeurs) sert de documentation
//  pour les nouveaux développeurs du projet.
