import pool from "../db/index.js";

export const chantierService = {
  async getChantierStatus() {
    const result = await pool.query("SELECT * FROM statut;");
    return result.rows; // retourne un tableau de statuts id, libelle
  },

  async getChantierPriority(){
      const result = await pool.query("SELECT * FROM priorite;");
      return result.rows; // retourne un tableau de priorités id, libelle
  },

  async getQA() {
    const result = await pool.query("SELECT id_user, name, firstname FROM users WHERE role = 1 ORDER BY name ASC;");
    console.log(result)
    return result.rows; // retourne un tableau de QA
  },
};