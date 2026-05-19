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