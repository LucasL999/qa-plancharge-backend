import pool from "../db/index.js";

export const dashboardService = {
  async getTotCap() {
    const result = await pool.query("SELECT nbused FROM users WHERE role = 1;");
    return result.rows; // retourne le total de nbused pour calculer la cap totale
  },

};