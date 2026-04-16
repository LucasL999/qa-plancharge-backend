import pool from "../db/index.js";

export const userService = {
  async findByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    return result.rows[0]; // undefined si pas trouvé
  },

  async getRoles() {
    const result = await pool.query(
      "SELECT * FROM role",

    );
    return result.rows; // retourne un tableau de rôles id, libelle
  },

  async getAllUsers() {
    const result = await pool.query(
      "SELECT id_user, name, firstname, email, libelle FROM users, role WHERE users.role = role.id_role ORDER BY name ASC"
    );
    return result.rows;
  },

  async addUser(nom, prenom, id_role, absences, email) {
    const result = await pool.query(
      "INSERT INTO users (name, firstname, role, nbannual, nbused, email) VALUES ($1, $2, $3, $4, 0, $5) RETURNING *"
      , [nom, prenom, id_role, absences, email]
    );
    return result.rows[0];
  },
};