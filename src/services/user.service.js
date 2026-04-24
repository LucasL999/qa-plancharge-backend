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
      "SELECT id_user, name, firstname, email, nbused, role, libelle FROM users JOIN role ON users.role = role.id_role ORDER BY name ASC"
    );
    return result.rows;
  },

  async addUser(nom, prenom, id_role, absences, email) {
    const result = await pool.query(
      "INSERT INTO users (name, firstname, role, nbannual, nbused, email) VALUES ($1, $2, $3, 0, $4, $5) RETURNING *"
      , [
        
        nom, prenom, id_role, absences, email]
    );
    return result.rows[0];
  },

  async updateUser(id_user,nom, prenom, id_role, absences, email) {
    const result = await pool.query(
      "UPDATE users SET name = $2, firstname = $3, role = $4, nbused = $5, email = $6 WHERE id_user = $1 RETURNING *"
      , [id_user, nom, prenom, id_role, absences, email]
    );
    return result.rows[0];
  },

  async deleteUsers(id_user) {
    const result = await pool.query(
      "DELETE FROM users WHERE id_user = $1;", [id_user]
    );
    return result.rows;
  },
};