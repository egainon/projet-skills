// Récupérer les données : fetch depuis le back : utilisation async await avec try/catch.

async function fetchSkillsAda() {
  try {
    const response = await fetch('http://localhost:4242/');
    const data = await response.json();
    // data contient tous les thèmes et leurs skills
    console.log(data);
  } catch (error) {
    console.error("Erreur fetch :", error);
  }
}

fetchSkillsAda();

// Organiser les données : regrouper les skills par thème.
function groupSkillsByTheme(data) {
  const themesMap = {}; //creation objet vide
  data.forEach(row => {
    //Vérification du thème
    if (!themesMap[row.libelle]) {//si ce thème n’existe pas encore dans themesMap
      themesMap[row.libelle] = { id: row.id, libelle: row.libelle, skills: [] };//creation objet vide si thème n'existe pas
    }
    if (row.intitule) { //si la ligne contient unskill
      themesMap[row.libelle].skills.push({ //ajoute skill au tableau skills du thème correspondant
        id: row.id,
        intitule: row.intitule,
        niveau: row.niveau
      });
    }
  });
  return Object.values(themesMap); //renvoie un tableau contenant toutes les valeurs de l’objet.
}


// Créer le HTML pour chaque thème : section, h2, ul.
// Créer le HTML pour chaque skill : li, div, h3, p.
// Ajouter les éléments au DOM : appendChild.
// Gérer les formulaires : addEventListener pour ajouter un nouveau skill.
// Ajouter d’autres interactions dynamiques si besoin.