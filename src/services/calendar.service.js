import pool from "../db/index.js";

export const calendarService = {
  async addEvent(email, date_debut, date_fin) {
    const resultUser = await pool.query("SELECT id_user FROM users WHERE email = $1;", [email]);
    if(resultUser.rows.length === 0){
        throw new Error("Utilisateur introuvable");
    }
    const idUser = resultUser.rows[0].id_user;
    const nbJours = Number((new Date(date_fin) - new Date(date_debut)) / (1000 * 60 * 60 * 24) + 1);
    const resultJours = await pool.query("UPDATE users set nbrestant = nbrestant - $1 WHERE id_user = $2", [nbJours, idUser]);
    const result = await pool.query(
      "INSERT INTO events (id_user, date_debut, date_fin) VALUES ($1, $2, $3) RETURNING *"
      , [idUser, date_debut, date_fin]
    );
    return result.rows[0];
  },

  async getEvent(email) {
    const result = await pool.query(
      "SELECT date_debut, date_fin FROM events JOIN users ON users.id_user = events.id_user WHERE users.email = $1",
      [email]
    );
    return result.rows;
  },

  async getEventOther(email) {
    const result = await pool.query(
      "SELECT firstname, name, date_debut, date_fin FROM events JOIN users ON users.id_user = events.id_user WHERE users.email != $1",
      [email]
    );
    return result.rows;
  },

  async deleteEvent(email, date_debut, date_fin) {
    const resultUser = await pool.query("SELECT id_user FROM users WHERE email = $1;", [email]);
    if(resultUser.rows.length === 0){
        throw new Error("Utilisateur introuvable");
    }
    const idUser = resultUser.rows[0].id_user;
    const resultnbJours = await pool.query("SELECT (date_fin - date_debut) +1 AS nb_jours FROM events WHERE id_user = $1 AND (date_debut = $2 OR date_fin = $3)", [idUser, date_debut, date_fin]);
    const nbJours = resultnbJours.rows[0]?.nb_jours || 0;
    const addJours = await pool.query("UPDATE users SET nbrestant = nbrestant + $1 WHERE id_user = $2", [nbJours, idUser]);
    const result = await pool.query(
      "DELETE FROM events WHERE id_user = $1 AND (date_debut = $2 OR date_fin = $3)  ",
      [idUser, date_debut, date_fin]
    );
    return result.rows;
  },

};