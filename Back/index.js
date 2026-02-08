require("dotenv").config();

const express = require('express');
const {neon} = require('@neondatabase/serverless');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4242;

// CORS cross-Origin Resource Sharing: règle de sécurité du navigateur qui 
// empêche une page web d’accéder à une APId’une autre origine sans 
// l’autorisation explicite du serveur.
app.use(cors({
  origin: "http://localhost:5500" // serveur pour le front
}));

// Parser JSON
app.use(express.json());

// Route GET : Récupérer tous les thèmes avec leurs skills
app.get('/themes', async (_, res) => {
    try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`
        SELECT
            themes.id AS theme_id,
            themes.libelle,
            skills.id AS skill_id,
            skills.intitule,
            skills.niveau
        FROM themes
        LEFT JOIN skills ON skills.themes_id = themes.id
        ORDER BY themes.id;
        `;
        console.log(response);
        res.json(response);
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Route POST : Ajouter un nouveau skill
app.post('/themes/:themeId/skills', async (req, res) => {
  try {
    const { themeId } = req.params;
    const { intitule, niveau } = req.body;
    
    if (!intitule) {
      return res.status(400).json({ error: "Le nom du skill est requis" });
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    const response = await sql`
      INSERT INTO skills (intitule, niveau, themes_id)
      VALUES (${intitule}, ${niveau || 50}, ${themeId})
      RETURNING *;
    `;
    
    console.log('Skill ajouté :', response[0]);
    res.status(201).json(response[0]);
    
  } catch (error) {
    console.error("Erreur SQL :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

//Lancmeent serveur
app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`);//serveur pour le back
})