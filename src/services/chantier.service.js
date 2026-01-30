import { pool } from '../db/index.js';

//* repplace actual function with database logic when DB is ready


//* Logic to take chantier data from db
export const getAllChantiers = () => {
  return [
    { id: 1, name: "Chantier Alpha" },
    { id: 2, name: "Chantier Beta" },
  ];
};

//export const getAllChantiers = async () => {
    //const result = await pool.query('SELECT * FROM chantiers');
    //return result.rows;
//};


//* Logic to create a chantier
export const createChantier = (chantierData) => {
  // Logic to create a chantier
  return { id: 3, ...chantierData };
};

//export const createChantier = async (chantierData) => {
    //const result = await pool.query(
        //'INSERT INTO chantiers (titre, id_environnement, id_statut, CP, 
        // date_debut, date_fin, prev, raf, cons, financement, capacité ) 
        // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        //[chantierData.titre, chantierData.id_environnement, chantierData.id_statut, 
        //chantierData.CP, chantierData.date_debut, chantierData.date_fin, 
        //chantierData.prev, chantierData.raf, chantierData.cons, 
        //chantierData.financement, chantierData.capacité]
    //);
    //return result.rows[0];
//};


//* Logic to update a chantier
export const updateChantier = (id, chantierData) => {
  // Logic to update a chantier
  return { id, ...chantierData };
};

//export const updateChantier = async (id, chantierData) => {
    //const result = await pool.query(
        //'UPDATE chantiers SET titre = ?, id_environnement = ?, id_statut = ?, 
        // CP = ?, date_debut = ?, date_fin = ?, prev = ?, raf = ?, cons = ?, financement = ?, capacité = ? WHERE id = ?',
        //[chantierData.titre, chantierData.id_environnement, chantierData.id_statut, 
        //chantierData.CP, chantierData.date_debut, chantierData.date_fin, 
        //chantierData.prev, chantierData.raf, chantierData.cons, 
        //chantierData.financement, chantierData.capacité, id]
    //);
    //return result.rows[0];
//};


//* Logic to get a chantier by ID
export const getChantierById = (id) => {
  return { id, name: "Chantier Alpha" };
};

//export const getChantierById = async (id) => {
    //const result = await pool.query('SELECT * FROM chantiers WHERE id = ?', [id]);
    //return result.rows[0];
//};