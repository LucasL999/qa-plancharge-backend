import pool from "../db/index.js";

export const userService = {
  async findByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    return result.rows[0]; // undefined si pas trouvé
  }
};