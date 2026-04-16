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
      "SELECT id_user, name, firstname, email, role FROM users ORDER BY name ASC"
    );
    return result.rows;
  },
};