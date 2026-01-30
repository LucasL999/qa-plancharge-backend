import { pool } from '../db/index.js';

//* repplace actual function with database logic when DB is ready


//* Logic to take calendar event data from db
export const getAllCalendarEvents = () => {
  return[
    { id: 1, name: "Calendar Event Alpha" },
    { id: 2, name: "Calendar Event Beta" },
  ];
};

//export const getAllCalendarEvents = async () => {
    //const result = await pool.query('SELECT * FROM calendar_events');
    //return result.rows;
//};


//* Logic to create a calendar event
export const createCalendarEvent = (eventData) => {
  // Logic to create a calendar event
  return { id: 3, ...eventData };
};

//export const createCalendarEvent = async (eventData) => {
    //const result = await pool.query(
        //'INSERT INTO calendar (id_user, date_debut, date_fin ) 
        // VALUES (?, ?, ?)',
        //[eventData.id_user, eventData.date_debut, eventData.date_fin]
    //);
    //return result.rows[0];
//};


//* Logic to update a calendar event
export const updateCalendarEvent = (id, eventData) => {
  // Logic to update a calendar event
  return { id, ...eventData };
};

//export const updateCalendarEvent = async (id, eventData) => {
    //const result = await pool.query(
        //'UPDATE calendar SET id_user = ?, date_debut = ?, date_fin = ? WHERE id = ?',
        //[eventData.id_user, eventData.date_debut, eventData.date_fin, id]
    //);
    //return result.rows[0];
//};


//* Logic to get a calendar event by ID
export const getCalendarEventById = (id) => {
  return { id, name: "Calendar Event Alpha" };
};

//export const getCalendarEventById = async (id) => {
    //const result = await pool.query('SELECT * FROM calendar WHERE id = ?', [id]);
    //return result.rows[0];
//};