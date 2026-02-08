require("dotenv").config();

const express = require('express');
const {neon} = require('@neondatabase/serverless');

const app = express();
const PORT = process.env.PORT || 4242;

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

app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`);
})