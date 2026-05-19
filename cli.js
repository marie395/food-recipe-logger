// Author: Tsamo Rooswell

const { readRecipes, writeRecipes } = require('./utils/fileHelper');

// Lire les arguments après "node cli.js"
const args = process.argv.slice(2);
const command = args[0];

// === Démonstration de l'Event Loop (obligatoire) ===
// fs.readFile est asynchrone : Node.js lance la lecture puis continue immédiatement
// C'est pourquoi "après l'appel" s'affiche AVANT le contenu du fichier
const fs = require('fs');
const path = require('path');

if (command === 'list') {
  console.log('après l\'appel'); // Ceci s'affiche EN PREMIER — Event Loop !
  readRecipes((err, data) => {
    // Ce callback s'exécute plus tard, quand le fichier est lu
    if (err) return console.error('Erreur:', err.message);
    console.log('\n=== Liste des recettes ===');
    data.recipes.forEach(r => {
      console.log(`[${r.id}] ${r.name} | ${r.cuisine} | ${r.prepTime} min`);
    });
  });

} else if (command === 'add') {
  // node cli.js add "Egusi Soup" "Nigerian" 40
  const [, name, cuisine, prepTime] = args;
  if (!name || !cuisine || !prepTime) {
    return console.log('Usage: node cli.js add "Nom" "Cuisine" tempsEnMinutes');
  }
  readRecipes((err, data) => {
    if (err) return console.error('Erreur:', err.message);
    const newId = data.recipes.length > 0
      ? Math.max(...data.recipes.map(r => r.id)) + 1
      : 1;
    const newRecipe = {
      id: newId,
      name,
      cuisine,
      prepTime: parseInt(prepTime),
      ingredients: []
    };
    data.recipes.push(newRecipe);
    writeRecipes(data, (writeErr) => {
      if (writeErr) return console.error('Erreur écriture:', writeErr.message);
      console.log(`Recette "${name}" ajoutée avec l'ID ${newId} !`);
    });
  });

} else if (command === 'search') {
  // node cli.js search "rice"
  const query = args[1];
  if (!query) return console.log('Usage: node cli.js search "motclé"');
  readRecipes((err, data) => {
    if (err) return console.error('Erreur:', err.message);
    const results = data.recipes.filter(r =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );
    if (results.length === 0) {
      console.log('Aucune recette trouvée pour :', query);
    } else {
      console.log(`\n=== Résultats pour "${query}" ===`);
      results.forEach(r => console.log(`[${r.id}] ${r.name} | ${r.cuisine}`));
    }
  });

} else {
  // Message d'aide si commande inconnue ou absente
  console.log(`
Usage :
  node cli.js list                          → affiche toutes les recettes
  node cli.js add "Nom" "Cuisine" minutes   → ajoute une recette
  node cli.js search "motclé"               → recherche par nom
  `);
}
