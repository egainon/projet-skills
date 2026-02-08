// Récupérer les données : fetch depuis le back : utilisation async await avec try/catch.

async function fetchSkillsAda() {
  try {
    const response = await fetch('http://localhost:4242/themes');
    const data = await response.json();
    // data contient tous les thèmes et leurs skills
    console.log(data);
    const themes = groupSkillsByTheme(data); //organisation des données
    displayThemes(themes); //creation du html
    addFormListeners(themes); //ajout des écouteurs d'événements sur less formulaires
  } catch (error) {
    console.error("Erreur fetch :", error);
  }
}

// Organiser les données : regrouper les skills par thème.
function groupSkillsByTheme(data) {
  const themesMap = {}; //creation objet vide
  data.forEach(row => {
    //Vérification du thème
    if (!themesMap[row.libelle]) {//si ce thème n’existe pas encore dans themesMap
      themesMap[row.libelle] = { id:row.theme_id, libelle: row.libelle, skills: [] };//creation objet vide si thème n'existe pas
    }
    if (row.intitule) { //si la ligne contient un skill
      themesMap[row.libelle].skills.push({ //ajoute skill au tableau skills du thème correspondant
        id: row.skill_id,
        intitule: row.intitule,
        niveau: row.niveau
      });
    }
  });
  return Object.values(themesMap); //renvoie un tableau contenant toutes les valeurs de l’objet.
}

// Créer le HTML pour chaque thème : section, h2, ul etc. affichage dans le dom
function displayThemes(themes) {
  const main = document.querySelector('main');
  main.innerHTML = ''; // Vider le main pour éviter les doublons
  //on parcourt chaque thème
  themes.forEach(theme => {
  // Creation du container pour le thème
  const section = document.createElement('section');
  section.id = `container-card-${theme.id}`; // id unique

  //creation div card
  const card = document.createElement('div');
  card.classList.add('card');

  // Création du libelle du thème
  const h2 = document.createElement('h2');
  h2.textContent = theme.libelle; 
  card.appendChild(h2); // ajouter le titre dans le container

  // Création de la liste des skills (vide pour l'instant)
  const ul = document.createElement('ul');
  ul.id = `skills-list-${theme.id}`;
  ul.setAttribute('aria-label', `Liste des skills ${theme.libelle}`);

   // on parcourt les skills du thème
    theme.skills.forEach(skill => {
    const li = createSkillElement(skill);
    ul.appendChild(li);
    });
    
    card.appendChild(ul);
    
    // Créer le formulaire
    const form = createForm(theme);
    card.appendChild(form);
    
    section.appendChild(card);
    main.appendChild(section);
  });
}

    // Créer le HTML pour chaque skill : li, div, h3, p
  function createSkillElement(skill) {
    const li = document.createElement('li');
  
    const div = document.createElement('div');
    div.classList.add('skill', skill.intitule.toLowerCase().replace(/\s+/g, '-'));

    const h3 = document.createElement('h3'); // nom du skill
    h3.textContent = skill.intitule;

    const p = document.createElement('p'); // niveau du skill
    p.classList.add('level');
    p.textContent = `${skill.niveau}%`;

    // organisation de la card
    div.appendChild(h3);
    div.appendChild(p);
    li.appendChild(div);

    return li;
  }

// creation du formulaire pour chaque thème
function createForm(theme) {
  const form = document.createElement('form');
  form.id = `form-${theme.id}`;
  form.setAttribute('aria-label', `Formulaire d'ajout de compétence ${theme.libelle}`);
  
  const label = document.createElement('label');
  label.setAttribute('for', `input-skill-${theme.id}`);
  label.textContent = 'Nouveau Skills : ';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.id = `input-skill-${theme.id}`;
  input.name = 'skillName';
  input.placeholder = theme.libelle === 'Frontend' ? 'HTML' : 'PostgreSQL';
  
  label.appendChild(input);
  form.appendChild(label);
  
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button');
  
  const button = document.createElement('button');
  button.type = 'submit';
  button.setAttribute('aria-label', `Ajouter un skill ${theme.libelle}`);
  button.textContent = 'Ajouter';
  
  buttonDiv.appendChild(button);
  form.appendChild(buttonDiv);
  
  return form;
}

// Gérer les formulaires : addEventListener pour ajouter un nouveau skill.
function addFormListeners(themes) {

  themes.forEach(theme => { 
    // sélection du formulaire du thème
    const form = document.getElementById(`form-${theme.id}`);   
    // si le formulaire existe
    if (form) {     
      // ecouteur d'évenment submit
      form.addEventListener('submit', async (event) => {
        event.preventDefault();//empêche rechargement page  
        // on récupère input du formulaire grace à name
        const input = form.querySelector('input[name="skillName"]')
        const skillName = input.value.trim(); //recupération saisie (sans les espaces)
        if (skillName === '') { // si le champ est vide
          alert('Veuillez entrer un nom de skill');
          return; // Arrête l'exécution
        }
      await addSkill(theme.id, skillName); // appel
      input.value = '';
      }); 
    } 
  }); 
}
        
// Fonction pour ajouter un skill au serveur
async function addSkill(themeId, skillName) {
  try {
    // Envoyer au backend
    const response = await fetch(`http://localhost:4242/themes/${themeId}/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intitule: skillName,
        niveau: 50 // niveau par défaut
      })
    });
    
    // Vérifier si la requête a réussi
    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout du skill');
    }
    
    // Récupérer le skill créé
    const newSkill = await response.json();
    console.log('Skill ajouté :', newSkill);
    
    // Ajouter le skill dans le DOM sans recharger la page
    addSkillToDOM(themeId, newSkill);
    
    // Message de confirmation
    alert('Skill ajouté avec succès !');
    
  } catch (error) {
    console.error('Erreur :', error);
    alert('Erreur lors de l\'ajout du skill');
  }
}

// fonction pour ajouter le skill dans le DOM
function addSkillToDOM(themeId, skill) {
  // Sélectionner la liste <ul> du thème
  const ul = document.getElementById(`skills-list-${themeId}`);
  
  if (ul) {
    // Créer le <li> pour le nouveau skill
    const li = createSkillElement(skill);
    
    // Ajouter le <li> dans la liste
    ul.appendChild(li);
  }
}

// Lancer l'application au chargement de la page
fetchSkillsAda();
