import pool from "../db/index.js";

export const chantierService = {
  async getChantierStatus() {
    const result = await pool.query("SELECT * FROM statut;");
    return result.rows; // retourne un tableau de statuts id, libelle
  },

  async getChantierPriority(){
      const result = await pool.query("SELECT * FROM priorite;");
      return result.rows; // retourne un tableau de priorités id, libelle
  }
};