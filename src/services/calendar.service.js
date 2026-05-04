import pool from "../db/index.js";

export const calendarService = {
  async addEvent(email, date_debut, date_fin) {
    const resultUser = await pool.query("SELECT id_user FROM users WHERE email = $1;", [email]);
    if(resultUser.rows.length === 0){
        throw new Error("Utilisateur introuvable");
    }
    const idUser = resultUser.rows[0].id_user;
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

};