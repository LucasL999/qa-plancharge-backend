import pool from "../db/index.js";

export const dashboardService = {
  async getTotCap() {
    const result = await pool.query("SELECT nbrestant FROM users WHERE role = 1;");
    return result.rows; // retourne le total de nbrestant pour calculer la cap totale
  },

};