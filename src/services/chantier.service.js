import pool from "../db/index.js";

export const chantierService = {
  async getChantierStatus() {
    const result = await pool.query("SELECT * FROM statut;");
    return result.rows; // retourne un tableau de statuts id, libelle
  },

  async getChantierPriority(){
      const result = await pool.query("SELECT * FROM priorite ORDER BY libelle;");
      return result.rows; // retourne un tableau de priorités id, libelle
  },

  async getQA() {
    const result = await pool.query("SELECT id_user, name, firstname FROM users WHERE role = 1 ORDER BY name ASC;");
    console.log(result)
    return result.rows; // retourne un tableau de QA
  },

  async addChantier(chantier, priorite, statut, qa, cp, financement, nature, capacite, prev, cons, debut, fin) {
    
    try{
      await pool.query('BEGIN');
      const result = await pool.query(
        "INSERT INTO chantier (titre, id_statut, cp, date_debut, date_fin, prev, cons, finance, capacite, id_priorite, nature) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id_chantier"
        , [
        
        chantier, statut, cp, debut, fin, prev, cons, financement, capacite, priorite, nature]
      );
      const idChantier = result.rows[0].id_chantier;
      for (const idUser of qa){
        await pool.query(
          "INSERT INTO affecter (id_chantier, id_user) VALUES($1, $2) RETURNING *"
          , [idChantier, idUser]
        );
      }
      await pool.query('COMMIT');
      return idChantier;
    }catch (error){
      await pool.query('ROLLBACK');
      throw error;
    }
  },

  async getChantier() {
    const result = await pool.query(`SELECT
      c.id_chantier,
      c.titre,
      s.libelle AS stat,
      s.id_statut,
      c.cp,
      c.date_debut,
      c.date_fin,
      c.prev,
      c.cons,
      c.finance,
      c.capacite,
      p.libelle AS prio,
      p.id_priorite,
      c.nature,
      JSON_AGG(
        JSONB_BUILD_OBJECT(
          'id', u.id_user,
          'firstname', u.firstname,
          'name', u.name
        )
      ) FILTER (WHERE u.id_user IS NOT NULL) AS qas
      FROM chantier c
      JOIN statut s ON c.id_statut = s.id_statut
      JOIN priorite p ON c.id_priorite = p.id_priorite
      LEFT JOIN affecter a ON c.id_chantier = a.id_chantier
      LEFT JOIN users u ON a.id_user = u.id_user
      GROUP BY
        c.id_chantier, c.titre, s.libelle, s.id_statut, c.cp, c.date_debut, c.date_fin,
        c.prev, c.cons, c.finance, c.capacite, p.libelle, p.id_priorite, c.nature;`);
    console.log(result)
    return result.rows; // retourne un tableau de QA
  },

  async updateChantier(id, priorite, statut, qa, cp, financement, nature, capacite, prev, cons, debut, fin) {
    
    try{
      await pool.query('BEGIN');
      await pool.query(
        `UPDATE chantier SET id_statut = $1 ,
          cp = $2,
          date_debut = $3,
          date_fin = $4,
          prev = $5,
          cons = $6,
          finance = $7,
          capacite = $8,
          id_priorite = $9,
          nature = $10
          WHERE id_chantier = $11;`
        , [ 
        statut, cp, debut, fin, prev, cons, financement, capacite, priorite, nature, id]
      );
      await pool.query(
        `DELETE FROM affecter WHERE id_chantier = $1;`
        ,[id]
      )
      for (const idUser of qa){
        await pool.query(
          "INSERT INTO affecter (id_chantier, id_user) VALUES($1, $2) RETURNING *"
          , [id, idUser]
        );
      }
      await pool.query('COMMIT');
      return id;
    }catch (error){
      await pool.query('ROLLBACK');
      throw error;
    }
  },
};
