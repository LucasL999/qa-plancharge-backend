import pool from "../db/index.js";

export const calendarService = {
  async addEvent(email, date_debut, date_fin) {
    const resultUser = await pool.query("SELECT id_user FROM users WHERE email = $1;", [email]);
    if (resultUser.rows.length === 0) {
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
      "SELECT events.id_event, date_debut, date_fin FROM events JOIN users ON users.id_user = events.id_user WHERE users.email = $1",
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

  // ---------------------------------------------------------------------------
  // SUPPRESSION - basée sur id_event (et non plus sur une comparaison de dates)
  // ---------------------------------------------------------------------------
  async deleteEvent(email, id_event) {
    const resultUser = await pool.query("SELECT id_user FROM users WHERE email = $1;", [email]);
    if (resultUser.rows.length === 0) {
      throw new Error("Utilisateur introuvable");
    }
    const idUser = resultUser.rows[0].id_user;

    const resultnbJours = await pool.query(
      "SELECT (date_fin - date_debut) + 1 AS nb_jours FROM events WHERE id_user = $1 AND id_event = $2",
      [idUser, id_event]
    );
    const nbJours = resultnbJours.rows[0]?.nb_jours || 0;

    await pool.query("UPDATE users SET nbrestant = nbrestant + $1 WHERE id_user = $2", [nbJours, idUser]);

    const result = await pool.query(
      "DELETE FROM events WHERE id_user = $1 AND id_event = $2 RETURNING *",
      [idUser, id_event]
    );
    return result.rows;
  },

  // ---------------------------------------------------------------------------
  // MODIFICATION - ajuste le solde de jours restants au prorata du delta
  // ---------------------------------------------------------------------------
  async updateEvent(email, id_event, date_debut, date_fin) {
    const resultUser = await pool.query("SELECT id_user FROM users WHERE email = $1;", [email]);
    if (resultUser.rows.length === 0) {
      throw new Error("Utilisateur introuvable");
    }
    const idUser = resultUser.rows[0].id_user;

    const resultOld = await pool.query(
      "SELECT (date_fin - date_debut) + 1 AS nb_jours FROM events WHERE id_user = $1 AND id_event = $2",
      [idUser, id_event]
    );
    if (resultOld.rows.length === 0) {
      throw new Error("Événement introuvable");
    }
    const oldNbJours = Number(resultOld.rows[0].nb_jours);
    const newNbJours = Number((new Date(date_fin) - new Date(date_debut)) / (1000 * 60 * 60 * 24) + 1);

    // on rembourse/décompte uniquement la différence entre l'ancienne et la nouvelle durée
    const diff = newNbJours - oldNbJours;
    if (diff !== 0) {
      await pool.query("UPDATE users SET nbrestant = nbrestant - $1 WHERE id_user = $2", [diff, idUser]);
    }

    const result = await pool.query(
      "UPDATE events SET date_debut = $1, date_fin = $2 WHERE id_user = $3 AND id_event = $4 RETURNING *",
      [date_debut, date_fin, idUser, id_event]
    );
    return result.rows[0];
  },

};