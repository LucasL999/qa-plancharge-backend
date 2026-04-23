import pool from "../db/index.js";

export const teamService = {
  async getAllTeam() {
    const result = await pool.query("SELECT * FROM users WHERE role = 1 ORDER BY name ASC;"); //récupère les QAs (role = 1)
    return result.rows; // retourne un tableau de QAs
  },


};